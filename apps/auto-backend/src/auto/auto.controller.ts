import {
  BadRequestException,
  Controller,
  Logger,
  Post,
  UnauthorizedException,
  UploadedFiles,
  UseInterceptors,
  Body,
} from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { AutoService } from './auto.service';
import { UserAuth } from '../auth/auth.decorator';
import { abis, getAptosClient } from '../aptos/aptos';
import { AutocompleteABI } from '../aptos/indes';
import { Account } from '@aptos-labs/ts-sdk';

const MAX_FILE_SIZE = 25 * 1024 * 1024;

@Controller('auto')
export class AutoController {
  logger = new Logger(AutoController.name);

  constructor(
    private readonly autoSvc: AutoService,
    private readonly serverAccount: Account,
  ) {}

  @Post()
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: 'paper', maxCount: 1 },
        { name: 'sketch', maxCount: 1 },
        { name: 'subject', maxCount: 1 },
      ],
      { limits: { fileSize: MAX_FILE_SIZE } },
    ),
  )
  async handle(
    @UploadedFiles() files: Record<string, { buffer: Buffer }[]>,
    @Body('promptType') promptType: string,
    @UserAuth() user: { address: `0x${string}` },
  ) {
    this.logger.log(`processing autocomplete for user: ${user.address}`);

    const devMode = this.autoSvc.isDevMode();

    if (!devMode) {
      const isUserElegible = await abis()
        .useABI(AutocompleteABI)
        .view.get_autocomplete_payment({
          typeArguments: [],
          functionArguments: [user.address],
        });

      if (!isUserElegible[0])
        throw new UnauthorizedException(
          'User not eligible for autocomplete payment',
        );
    }

    for (const k of ['paper', 'sketch'])
      if (!files[k]?.[0]) throw new BadRequestException(`${k}.png required`);

    // Create a map of all file buffers
    const buffers: Record<string, Buffer> = {};

    // Add required files
    buffers.paper = files.paper[0].buffer;
    buffers.sketch = files.sketch[0].buffer;

    // Add optional subject file if provided
    if (files.subject?.[0]) {
      buffers.subject = files.subject[0].buffer;
    }

    const imageUrl = await this.autoSvc.generate(buffers, promptType);

    if (!devMode) {
      const aptos = getAptosClient();

      const transaction = await aptos.transaction.build.simple({
        sender: this.serverAccount.accountAddress,
        data: {
          function:
            '0x02033b72957c2f0b66cf5be479a2aa098d5bf18c36477907eba8be39435f2811::autocomplete::reset_payment',
          typeArguments: [],
          functionArguments: [user.address],
        },
        options: {
          maxGasAmount: 100000,
        },
      });

      const tx = await aptos.signAndSubmitTransaction({
        signer: this.serverAccount,
        transaction,
      });

      this.logger.log(
        `Transaction: https://explorer.aptoslabs.com/txn/${tx.hash} successfully created`,
      );
    }

    return { imageUrl };
  }
}
