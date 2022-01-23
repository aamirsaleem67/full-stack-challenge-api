import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsDefined,
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsString,
  Max,
  MaxLength,
  Min,
  MinLength,
  ValidateNested,
} from 'class-validator';
import { DATE_FORMAT } from '../../shared/constants';
import { IsOnlyDate } from '../../shared/decorators/is-only-date.decorator';

export class CreateAddressDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  addressLine1: string;

  @ApiProperty({ minLength: 4, maxLength: 20 })
  @IsString()
  @MinLength(4)
  @MaxLength(20)
  postalCode: string;

  @ApiProperty({
    description: 'Alpha-2 country code',
    minLength: 2,
    maxLength: 2,
  })
  @IsString()
  @MinLength(2)
  @MaxLength(2)
  countryCode: string;

  @ApiProperty({
    maxLength: 200,
  })
  @IsString()
  @MinLength(2)
  @MaxLength(200)
  city: string;
}

export class CreateBookerDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  lastName: string;

  @ApiProperty()
  @IsDefined()
  @ValidateNested()
  @Type(() => CreateAddressDto)
  address: CreateAddressDto;

  @ApiProperty()
  @IsEmail()
  email: string;

  @ApiProperty({
    example: '+49 1234567',
  })
  @IsString()
  @IsNotEmpty()
  phone: string;
}

export class CreateBookingDto {
  @ApiProperty()
  @IsDefined()
  @ValidateNested()
  @Type(() => CreateBookerDto)
  booker: CreateBookerDto;

  @ApiProperty({ type: 'string', format: 'date', example: DATE_FORMAT })
  @IsOnlyDate()
  arrival: string;

  @ApiProperty({ type: 'string', format: 'date', example: DATE_FORMAT })
  @IsOnlyDate()
  departure: string;

  @ApiProperty({
    minItems: 1,
    maxItems: 15,
  })
  @IsNumber()
  @Min(1)
  @Max(15)
  @Type(() => Number)
  adults: number;
}
