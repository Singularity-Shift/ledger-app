import { IsString } from 'class-validator';

export class PayloadDto {
  @IsString()
  signature: string;

  @IsString()
  message: string;

  @IsString()
  address: string;

  @IsString()
  publicKey: string;
}
