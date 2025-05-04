import {
  Account,
  Ed25519PrivateKey,
  HexInput,
  PrivateKey,
  PrivateKeyVariants,
} from '@aptos-labs/ts-sdk';
import { Module } from '@nestjs/common';
import { ConfigModule } from '../config/config.module';
import { ConfigService } from '../config/config.service';
import { getAptosClient } from 'src/aptos/aptos';

export type ServerAccountProvider = Account;

export const serverAccountProvider = {
  provide: Account,
  inject: [ConfigService],
  useFactory: async (configService: ConfigService) => {
    const aptos = getAptosClient();

    const account = aptos.account.deriveAccountFromPrivateKey({
      privateKey: new Ed25519PrivateKey(
        PrivateKey.formatPrivateKey(
          configService.get<HexInput>('serverAccount.key') as HexInput,
          PrivateKeyVariants.Ed25519,
        ),
      ),
    });

    return account;
  },
};

@Module({
  imports: [ConfigModule],
  providers: [serverAccountProvider],
  exports: [Account],
})
export class ServerAccountModule {}
