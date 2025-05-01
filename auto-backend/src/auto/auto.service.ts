import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import OpenAI, { toFile } from 'openai';
import { Readable } from 'stream';
import { Storage } from '@google-cloud/storage';
import * as path from 'path';
import * as fs from 'fs';

type ImageMap = Record<string, Buffer>;

@Injectable()
export class AutoService {
  private readonly logger = new Logger(AutoService.name);
  private openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });
  private storage: Storage;
  private bucketName = 'sshift-gpt-bucket';
  private folderPath = 'ledger-app';

  constructor() {
    // Initialize Google Cloud Storage with credentials file
    const credentialsPath = path.resolve(process.cwd(), 'sshiftdao-ai-8c84658189d0.json');
    
    // Log credentials file info to diagnose issues
    this.logger.log(`Using credentials file at: ${credentialsPath}`);
    if (fs.existsSync(credentialsPath)) {
      this.logger.log(`Credentials file exists`);
      try {
        const creds = JSON.parse(fs.readFileSync(credentialsPath, 'utf8'));
        this.logger.log(`Project ID from credentials: ${creds.project_id}`);
        this.logger.log(`Client email from credentials: ${creds.client_email}`);
      } catch (err) {
        this.logger.error(`Failed to parse credentials file: ${err.message}`);
      }
    } else {
      this.logger.error(`Credentials file not found at: ${credentialsPath}`);
    }
    
    this.storage = new Storage({
      keyFilename: credentialsPath
    });
    
    this.logger.log(`Initialized Storage client using credentials file for bucket: ${this.bucketName}`);
    
    // Verify bucket access
    this.verifyBucketAccess();
  }
  
  private async verifyBucketAccess() {
    try {
      this.logger.log(`Verifying access to bucket: ${this.bucketName}`);
      const [exists] = await this.storage.bucket(this.bucketName).exists();
      if (exists) {
        this.logger.log(`Successfully verified bucket access to: ${this.bucketName}`);
      } else {
        this.logger.error(`Bucket does not exist: ${this.bucketName}`);
      }
    } catch (error) {
      this.logger.error(`Failed to access bucket: ${this.bucketName}`, error);
    }
  }

  private readonly PROMPT = `
You are an expert image tracing illustrator specializing in pencil, ink pen, charcoal, and selective colored pencil techniques. Your task is to creatively complete and reinterpret a composition using expressive, raw, hand-drawn marks, based on a provided SketchImage and a PaperCanvas background. The user may not trace an image; therefore, only paper.png and sketch.png will be provided. In this case, engage maximum creativity and attempt to extrapolate the user's intended image. If a SubjectImage is provided, use it as inspiration — otherwise, rely on the SketchImage alone. Focus on: • Loose, confident inked line work • Bold, smoky, rapidly-laid charcoal shading • Quick, flowing atmospheric contrasts and rough gradients • Wild, expressive cross-hatching and aggressive gestural pencil strokes • Sparingly used colored pencil accents for richness, contrast, and fine detail — color must support the emotional texture, not dominate it. Your artistic interpretation must prioritize energy, speed, and feeling over precision. Anatomical or photographic accuracy is secondary to motion, mood, and emotional texture. Special Instructions: • You are provided two or three files: ◦ Paper.png (PaperCanvas): This must be used unaltered as the background layer. Do not modify, recolor, brighten, darken, crop, or resize it. It remains exactly as given. ◦ Sketch.png (SketchImage): This is the user's partial or rough trace with a transparent background. Treat this as an underdrawing or first-pass gesture layer to be respected and completed. Build upon it, enhance it, or reinterpret it in your unique expressive style — but do not erase or ignore it. Integrate it with intention. ◦ SubjectImage.png (SubjectImage): Optional. If provided, use it to creatively extrapolate further detail or emotional context. If no SubjectImage is provided, engage full creative extrapolation based solely on the SketchImage. • Color Usage Rules: ◦ If the user has drawn color into Sketch.png, it is a direct request and must be included and respected. ◦ If a SubjectImage is provided, you may extrapolate some colors sparingly from it — but keep the use of these extrapolated colors minimal and purposeful. • The final output must be a square image. If a SubjectImage is provided and is not square, crop and center the middle square portion before referencing it. The PaperCanvas defines the full frame. • Do not draw bright highlights or light grey tones lighter than hex #B0B0B0. Where lightness would normally occur, allow the PaperCanvas to show through untouched. No transparency is needed — the PaperCanvas is your "light." • Do not solidly fill large areas. Preserve breathing space. Let the paper texture shine through. • Colored pencils must be used sparingly and purposefully: Only to intensify contrast, enrich emotional hotspots, or pick out subtle highlights and textures. The overall piece must remain primarily grayscale, with color accents feeling like fleeting bursts of life. • Respect the PaperCanvas texture and let it interact with your strokes. • Embrace abstraction, rapid gestural marks, and imperfection. Avoid polished rendering or mechanical precision. The final drawing must feel raw, alive, and emotionally textured — as if finished in a rush of inspired motion, building upon the user's marks without hesitation. Proceed directly to the task. Do not provide explanations. Do not ask questions. Begin.
`.trim();

  async generate(files: ImageMap): Promise<string> {
    this.logger.log('Starting image generation...');
    try {
      // Convert all buffer files to OpenAI compatible file objects
      const imageFiles = [];
      
      // Add paper and sketch files (required)
      const paperFile = await toFile(Readable.from(files.paper), 'paper.png', { type: 'image/png' });
      imageFiles.push(paperFile);
      
      const sketchFile = await toFile(Readable.from(files.sketch), 'sketch.png', { type: 'image/png' });
      imageFiles.push(sketchFile);
      
      // Add subject file if provided
      if (files.subject) {
        const subjectFile = await toFile(Readable.from(files.subject), 'subject.png', { type: 'image/png' });
        imageFiles.push(subjectFile);
      }
      
      this.logger.log(`Files prepared, calling OpenAI images.edit with ${imageFiles.length} images...`);
      const rsp = await this.openai.images.edit({
        model: 'gpt-image-1',
        image: imageFiles, // Pass array of images instead of just one
        prompt: this.PROMPT,
      });
      this.logger.log('OpenAI call successful.');

      // Get the image buffer from base64
      if (!rsp.data || !rsp.data[0] || !rsp.data[0].b64_json) {
        throw new InternalServerErrorException('Invalid response from OpenAI');
      }
      const imageBuffer = Buffer.from(rsp.data[0].b64_json, 'base64');
      
      // Generate a unique filename for the image
      const timestamp = Date.now();
      const filename = `${this.folderPath}/generated-image-${timestamp}.png`;
      
      try {
        // Upload to Google Cloud Storage
        this.logger.log(`Uploading image to Google Cloud Storage: ${filename}`);
        const bucket = this.storage.bucket(this.bucketName);
        this.logger.log(`Bucket details - name: ${bucket.name}, id: ${bucket.id}`);
        const file = bucket.file(filename);

        await file.save(imageBuffer, {
          metadata: { contentType: 'image/png' },
        });

        // Generate a signed URL valid for 7 days
        const [signedUrl] = await file.getSignedUrl({ action: 'read', expires: Date.now() + 7 * 24 * 60 * 60 * 1000 });
        this.logger.log(`Image uploaded, signed URL: ${signedUrl}`);
        return signedUrl;
      } catch (storageError) {
        this.logger.error(`Failed to upload to Google Cloud Storage: ${storageError.message}`, storageError);
        // Return base64 data URL as fallback
        const base64Url = `data:image/png;base64,${rsp.data[0].b64_json}`;
        this.logger.log(`Returning base64 data URL as fallback`);
        return base64Url;
      }
    } catch (error) {
      this.logger.error('Error during processing:', error);
      if (error instanceof Error) {
         this.logger.error('Error details:', error.message, error.stack);
      }
      throw new InternalServerErrorException('Failed to process image');
    }
  }
} 