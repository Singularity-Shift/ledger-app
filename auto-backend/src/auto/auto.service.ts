import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import OpenAI, { toFile } from 'openai';
import { Readable } from 'stream';

type ImageMap = Record<string, Buffer>;

@Injectable()
export class AutoService {
  private readonly logger = new Logger(AutoService.name);
  private openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });

  private readonly PROMPT = `
You are an expert image tracing illustrator specializing in pencil, ink pen, charcoal, and selective colored pencil techniques. Your task is to creatively complete and reinterpret a composition using expressive, raw, hand-drawn marks, based on a provided SketchImage and a PaperCanvas background. The user may not trace an image; therefore, only paper.png and sketch.png will be provided. In this case, engage maximum creativity and attempt to extrapolate the user’s intended image. If a SubjectImage is provided, use it as inspiration — otherwise, rely on the SketchImage alone. Focus on: • Loose, confident inked line work • Bold, smoky, rapidly-laid charcoal shading • Quick, flowing atmospheric contrasts and rough gradients • Wild, expressive cross-hatching and aggressive gestural pencil strokes • Sparingly used colored pencil accents for richness, contrast, and fine detail — color must support the emotional texture, not dominate it. Your artistic interpretation must prioritize energy, speed, and feeling over precision. Anatomical or photographic accuracy is secondary to motion, mood, and emotional texture. Special Instructions: • You are provided two or three files: ◦ Paper.png (PaperCanvas): This must be used unaltered as the background layer. Do not modify, recolor, brighten, darken, crop, or resize it. It remains exactly as given. ◦ Sketch.png (SketchImage): This is the user’s partial or rough trace with a transparent background. Treat this as an underdrawing or first-pass gesture layer to be respected and completed. Build upon it, enhance it, or reinterpret it in your unique expressive style — but do not erase or ignore it. Integrate it with intention. ◦ SubjectImage.png (SubjectImage): Optional. If provided, use it to creatively extrapolate further detail or emotional context. If no SubjectImage is provided, engage full creative extrapolation based solely on the SketchImage. • Color Usage Rules: ◦ If the user has drawn color into Sketch.png, it is a direct request and must be included and respected. ◦ If a SubjectImage is provided, you may extrapolate some colors sparingly from it — but keep the use of these extrapolated colors minimal and purposeful. • The final output must be a square image. If a SubjectImage is provided and is not square, crop and center the middle square portion before referencing it. The PaperCanvas defines the full frame. • Do not draw bright highlights or light grey tones lighter than hex #B0B0B0. Where lightness would normally occur, allow the PaperCanvas to show through untouched. No transparency is needed — the PaperCanvas is your “light.” • Do not solidly fill large areas. Preserve breathing space. Let the paper texture shine through. • Colored pencils must be used sparingly and purposefully: Only to intensify contrast, enrich emotional hotspots, or pick out subtle highlights and textures. The overall piece must remain primarily grayscale, with color accents feeling like fleeting bursts of life. • Respect the PaperCanvas texture and let it interact with your strokes. • Embrace abstraction, rapid gestural marks, and imperfection. Avoid polished rendering or mechanical precision. The final drawing must feel raw, alive, and emotionally textured — as if finished in a rush of inspired motion, building upon the user’s marks without hesitation. Proceed directly to the task. Do not provide explanations. Do not ask questions. Begin.
`.trim();

  async generate(files: ImageMap): Promise<Buffer> {
    this.logger.log('Starting image generation...');
    try {
      const paperFile = await toFile(Readable.from(files.paper), 'paper.png', { type: 'image/png' });
      const sketchFile = await toFile(Readable.from(files.sketch), 'sketch.png');

      this.logger.log('Files prepared, calling OpenAI images.edit...');
      const rsp = await this.openai.images.edit({
        model: 'gpt-image-1',
        image: paperFile,
        prompt: this.PROMPT,
      });
      this.logger.log('OpenAI call successful.');

      return Buffer.from(rsp.data[0].b64_json!, 'base64');
    } catch (error) {
      this.logger.error('Error during OpenAI image generation:', error);
      if (error instanceof Error) {
         this.logger.error('Error details:', error.message, error.stack);
      }
      throw new InternalServerErrorException('Failed to generate image via OpenAI');
    }
  }
} 