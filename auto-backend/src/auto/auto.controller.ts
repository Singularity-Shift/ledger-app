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

    // Create a map of all file buffers
    const buffers: Record<string, Buffer> = {};
    
    // Add required files
    buffers.paper = files.paper[0].buffer;
    buffers.sketch = files.sketch[0].buffer;
    
    // Add optional subject file if provided
    if (files.subject?.[0]) {
      buffers.subject = files.subject[0].buffer;
    }

    const imageUrl = await this.autoSvc.generate(buffers);
    return { imageUrl };
  }
}
 