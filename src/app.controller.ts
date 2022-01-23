import { Controller, Get } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { PongDto } from './dtos/pong.dto';

@ApiTags('App')
@Controller('app')
export class AppController {
  @ApiOkResponse({
    description: 'Ping the application health status',
    type: PongDto,
  })
  @Get('ping')
  ping(): PongDto {
    return { text: 'pong' };
  }
}
