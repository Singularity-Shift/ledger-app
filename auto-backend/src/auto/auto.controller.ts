import {
  BadRequestException,
  Controller,
  Header,
  Post,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import {
  FileFieldsInterceptor,
} from '@nestjs/platform-express';
import { AutoService } from './auto.service';

const MAX_FILE_SIZE = 25 * 1024 * 1024;

@Controller('api/auto')
export class AutoController {
  constructor(private readonly autoSvc: AutoService) {}

  @Post()
  @Header('Content-Type', 'image/png')
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
  ) {
    for (const k of ['paper', 'sketch'])
      if (!files[k]?.[0])
        throw new BadRequestException(`${k}.png required`);

    const buffers = Object.fromEntries(
      Object.entries(files).map(([k, [f]]) => [k, f.buffer]),
    );

    return this.autoSvc.generate(buffers); // → Buffer of PNG
  }
}
