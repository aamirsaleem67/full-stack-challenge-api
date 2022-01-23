import { ApiProperty } from '@nestjs/swagger';
import { DATE_FORMAT } from '../..//shared/constants';

export class AddressDto {
  @ApiProperty()
  addressLine1: string;

  @ApiProperty()
  postalCode: string;

  @ApiProperty()
  countryCode: string;

  @ApiProperty()
  city: string;
}

export class BookerDto {
  @ApiProperty()
  firstName: string;

  @ApiProperty()
  lastName: string;

  @ApiProperty()
  address: AddressDto;

  @ApiProperty()
  email: string;

  @ApiProperty()
  phone: string;
}

export class BookingDto {
  @ApiProperty()
  booker: BookerDto;

  @ApiProperty({ type: 'string', format: 'date', example: DATE_FORMAT })
  arrival: Date;

  @ApiProperty({ type: 'string', format: 'date', example: DATE_FORMAT })
  departure: Date;

  @ApiProperty()
  adults: number;
}
