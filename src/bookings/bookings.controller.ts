import { Controller, Get, Post, Body, Query } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { BookingsService } from './bookings.service';
import { BookingDto } from './dto/booking.dto';
import { CreateBookingDto } from './dto/create-booking.dto';
import { FindBookingsQueryDto } from './dto/find-bookings-query.dto';

@ApiTags('Bookings')
@Controller('bookings')
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) {}

  @ApiOkResponse({
    type: BookingDto,
  })
  @Post()
  async create(@Body() createBookingDto: CreateBookingDto) {
    return await this.bookingsService.create(createBookingDto);
  }

  // TODO: apply pagination
  @ApiOkResponse({
    type: BookingDto,
    isArray: true,
  })
  @Get()
  async findAll(@Query() filter: FindBookingsQueryDto) {
    return await this.bookingsService.findAll(filter);
  }
}
