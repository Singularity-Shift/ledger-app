import { Injectable } from '@nestjs/common';
import OpenAI, { toFile } from 'openai';
import { Readable } from 'stream';

type ImageMap = Record<string, Buffer>;

@Injectable()
export class AutoService {
  private openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });

  private readonly PROMPT = `
You are an expert image-tracing illustrator specialising in pencil, ink pen,
charcoal, and selective coloured-pencil techniques.

<─── paste the full art-direction block you wrote earlier ───>
`.trim();

  async generate(files: ImageMap): Promise<Buffer> {
    // Prepare required files: paper as image, sketch as mask
    const paperFile = await toFile(Readable.from(files.paper), 'paper.png');
    const sketchFile = await toFile(Readable.from(files.sketch), 'sketch.png');
    const rsp = await this.openai.images.edit({
      model: 'gpt-image-1',
      image: paperFile,
      mask: sketchFile,
      prompt: this.PROMPT,
      response_format: 'b64_json',
    });

    return Buffer.from(rsp.data[0].b64_json!, 'base64');
  }
} 