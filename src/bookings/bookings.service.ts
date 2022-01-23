import { ConflictException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { utc } from 'moment';
import { Model } from 'mongoose';
import { BookingsValidatorService } from './bookings-validator.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { FindBookingsQueryDto } from './dto/find-bookings-query.dto';
import { Booking, BookingDocument } from './schemas/booking.schema';

@Injectable()
export class BookingsService {
  constructor(
    @InjectModel(Booking.name) private readonly model: Model<BookingDocument>,
    private readonly validatorService: BookingsValidatorService,
  ) {}

  async create(createBookingDto: CreateBookingDto): Promise<BookingDocument> {
    this.validatorService.validate(createBookingDto);
    const arrival: Date = utc(createBookingDto.arrival).toDate();
    const departure: Date = utc(createBookingDto.departure).toDate();

    await this.ensureAvailability(arrival, departure);

    return await this.model.create({
      ...createBookingDto,
      arrival: utc(createBookingDto.arrival).toDate(),
      departure: utc(createBookingDto.departure).toDate(),
    });
  }

  // TODO: apply pagination
  async findAll(filter: FindBookingsQueryDto): Promise<BookingDocument[]> {
    return await this.model
      .find({
        ...filter,
      })
      .sort({ createdAt: 'asc' })
      .exec();
  }

  private async ensureAvailability(
    givenArrivalDate: Date,
    givenDepartureDate: Date,
  ): Promise<void> {
    const bookingExist: boolean = await this.model.exists({
      $or: [
        {
          $and: [
            {
              arrival: {
                $gte: givenArrivalDate,
              },
            },
            {
              departure: {
                $lte: givenDepartureDate,
              },
            },
          ],
        }, // out of boundary
        {
          $and: [
            {
              arrival: {
                $lte: givenArrivalDate,
              },
            },
            {
              departure: {
                $gte: givenDepartureDate,
              },
            },
          ],
        }, // between values
        {
          departure: {
            $eq: givenArrivalDate,
          },
        },
        {
          arrival: {
            $eq: givenDepartureDate,
          },
        },
      ],
    });

    if (bookingExist) {
      throw new ConflictException('Booking already exist for the given dates');
    }
  }
}
