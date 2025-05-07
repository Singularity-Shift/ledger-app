export class GetModerationDto {
  isFlagged: boolean;

  static fromPrimitive(isFlagged: boolean): GetModerationDto {
    return new GetModerationDto(isFlagged);
  }

  constructor(isFlagged: boolean) {
    this.isFlagged = isFlagged;
  }
}
