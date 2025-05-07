import { Body, Controller, Post } from '@nestjs/common';
import { ModerationService } from './moderation.service';
import { ModerationDto } from './dto/moderation.dto';
import { GetModerationDto } from './dto/get-moderation.dto';

@Controller('moderation')
export class ModerationController {
  constructor(private readonly moderationService: ModerationService) {}

  @Post()
  async checkImage(
    @Body() moderationDto: ModerationDto,
  ): Promise<GetModerationDto> {
    const isFlagged = await this.moderationService.checkImage(
      moderationDto.image,
    );

    return GetModerationDto.fromPrimitive(isFlagged);
  }
}
