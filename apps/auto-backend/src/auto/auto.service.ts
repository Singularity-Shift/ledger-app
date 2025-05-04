import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import OpenAI, { toFile } from 'openai';
import { Readable } from 'stream';
import { Storage } from '@google-cloud/storage';
import * as path from 'path';
import * as fs from 'fs';
import { ConfigService } from 'src/config/config.service';

type ImageMap = Record<string, Buffer>;
interface PromptConfig {
  prompt: string;
}

@Injectable()
export class AutoService {
  private readonly logger = new Logger(AutoService.name);
  private storage: Storage;
  private bucketName = 'sshift-gpt-bucket';
  private folderPath = 'ledger-app';
  private readonly PROMPT: string;

  constructor(
    private readonly openai: OpenAI,
    private readonly configService: ConfigService,
  ) {
    // Load prompt from JSON file
    try {
      const promptPath = path.resolve(
        process.cwd(),
        'auto-backend-prompt.json',
      );
      this.logger.log(`Loading prompt from: ${promptPath}`);

      if (fs.existsSync(promptPath)) {
        const promptConfig: PromptConfig = JSON.parse(
          fs.readFileSync(promptPath, 'utf8'),
        );
        this.PROMPT = promptConfig.prompt;
        this.logger.log('Successfully loaded prompt from JSON file');
      } else {
        // Try alternate path
        const altPath = path.resolve(
          process.cwd(),
          '..',
          'auto-backend-prompt.json',
        );
        this.logger.log(`Trying alternate path: ${altPath}`);

        if (fs.existsSync(altPath)) {
          const promptConfig: PromptConfig = JSON.parse(
            fs.readFileSync(altPath, 'utf8'),
          );
          this.PROMPT = promptConfig.prompt;
          this.logger.log(
            'Successfully loaded prompt from JSON file (alternate path)',
          );
        } else {
          this.logger.warn(`Prompt file not found, using default prompt`);
          this.PROMPT =
            'You are an expert image tracing illustrator specializing in pencil, ink pen, charcoal, and selective colored pencil techniques...'; // Just a fallback
        }
      }
    } catch (error) {
      this.logger.error(`Failed to load prompt from JSON: ${error.message}`);
      this.PROMPT =
        'You are an expert image tracing illustrator specializing in pencil, ink pen, charcoal, and selective colored pencil techniques...'; // Just a fallback
    }

    const credentialsBase64 = configService.get<string>(
      'storage.storageCredentials',
    ) as string;

    const credentialsJson = Buffer.from(credentialsBase64, 'base64').toString(
      'utf-8',
    );

    const credentials = JSON.parse(credentialsJson);
    const projectId = this.configService.get<string>('storage.project_id');

    this.storage = new Storage({
      projectId,
      credentials,
    });

    this.logger.log(
      `Initialized Storage client using credentials file for bucket: ${this.bucketName}`,
    );

    // Verify bucket access
    this.verifyBucketAccess();
  }

  private async verifyBucketAccess() {
    try {
      this.logger.log(`Verifying access to bucket: ${this.bucketName}`);
      const [exists] = await this.storage.bucket(this.bucketName).exists();
      if (exists) {
        this.logger.log(
          `Successfully verified bucket access to: ${this.bucketName}`,
        );
      } else {
        this.logger.error(`Bucket does not exist: ${this.bucketName}`);
      }
    } catch (error) {
      this.logger.error(`Failed to access bucket: ${this.bucketName}`, error);
    }
  }

  async generate(files: ImageMap): Promise<string> {
    this.logger.log('Starting image generation...');
    try {
      // Convert all buffer files to OpenAI compatible file objects
      const imageFiles = [];

      // Add paper and sketch files (required)
      const paperFile = await toFile(Readable.from(files.paper), 'paper.png', {
        type: 'image/png',
      });
      imageFiles.push(paperFile);

      const sketchFile = await toFile(
        Readable.from(files.sketch),
        'sketch.png',
        { type: 'image/png' },
      );
      imageFiles.push(sketchFile);

      // Add subject file if provided
      if (files.subject) {
        const subjectFile = await toFile(
          Readable.from(files.subject),
          'subject.png',
          { type: 'image/png' },
        );
        imageFiles.push(subjectFile);
      }

      this.logger.log(
        `Files prepared, calling OpenAI images.edit with ${imageFiles.length} images...`,
      );
      const rsp = await this.openai.images.edit({
        model: 'gpt-image-1',
        image: imageFiles, // Pass array of images instead of just one
        prompt: this.PROMPT,
        size: '1024x1024', // Always request a square image
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
        this.logger.log(
          `Bucket details - name: ${bucket.name}, id: ${bucket.id}`,
        );
        const file = bucket.file(filename);

        await file.save(imageBuffer, {
          metadata: { contentType: 'image/png' },
        });

        // Generate a signed URL valid for 7 days
        const [signedUrl] = await file.getSignedUrl({
          action: 'read',
          expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
        });
        this.logger.log(`Image uploaded, signed URL: ${signedUrl}`);
        return signedUrl;
      } catch (storageError) {
        this.logger.error(
          `Failed to upload to Google Cloud Storage: ${storageError.message}`,
          storageError,
        );
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

  isDevMode() {
    return this.configService.get<boolean>('devMode');
  }
}
