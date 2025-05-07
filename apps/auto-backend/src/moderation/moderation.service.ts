import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import OpenAI from 'openai';

@Injectable()
export class ModerationService {
  logger = new Logger(ModerationService.name);

  constructor(private readonly openai: OpenAI) {}

  async checkImage(imageDataUrl: string): Promise<boolean> {
    if (!imageDataUrl || !imageDataUrl.startsWith('data:image/')) {
      throw new BadRequestException('Invalid image data URL provided.');
    }

    this.logger.log('Moderating image...');

    try {
      const response = await this.openai.moderations.create({
        model: 'omni-moderation-latest',
        input: [
          {
            type: 'image_url',
            image_url: {
              url: imageDataUrl,
            },
          },
        ],
      });

      this.logger.log('Moderation response:', response);

      // Check if any result is flagged
      const isFlagged = response.results.some((result) => result.flagged);

      if (isFlagged) {
        this.logger.warn(
          'Image flagged by moderation:',
          response.results.filter((r) => r.flagged),
        );
      } else {
        this.logger.log('Image passed moderation.');
      }

      return isFlagged;
    } catch (error) {
      this.logger.error('Error calling OpenAI Moderation API:', error);
      // Depending on policy, you might want to block submission on API error
      // or allow it with a warning. Here, we throw to indicate failure.
      throw new InternalServerErrorException(
        `Failed to moderate image: ${error instanceof Error ? error.message : String(error)}`,
      );
    }
  }
}
