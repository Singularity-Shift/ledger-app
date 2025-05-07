import { IsString } from 'class-validator';

export class ModerationDto {
  @IsString()
  image: string;
}
