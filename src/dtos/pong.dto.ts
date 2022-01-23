import { ApiProperty } from '@nestjs/swagger';

export class PongDto {
  @ApiProperty()
  text: string;
}
