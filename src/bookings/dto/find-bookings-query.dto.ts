import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsMongoId, IsNumber, IsOptional } from 'class-validator';
import { DATE_FORMAT } from '../../shared/constants';
import { IsOnlyDate } from '../../shared/decorators/is-only-date.decorator';

export class FindBookingsQueryDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsMongoId()
  _id?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  adults?: number;

  @ApiPropertyOptional({ type: 'string', format: 'date', example: DATE_FORMAT })
  @IsOptional()
  @IsOnlyDate()
  arrival?: string;

  @ApiPropertyOptional({ type: 'string', format: 'date', example: DATE_FORMAT })
  @IsOptional()
  @IsOnlyDate()
  departure?: string;
}
