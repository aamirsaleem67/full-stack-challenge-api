import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { Moment, utc } from 'moment';
import { DATE_FORMAT } from '../shared/constants';
import { CreateBookingDto } from './dto/create-booking.dto';

@Injectable()
export class BookingsValidatorService {
  validate(dto: CreateBookingDto): void {
    const errors: string[] = [...this.validateDates(dto)];

    if (errors.length) {
      throw new UnprocessableEntityException(errors);
    }
  }

  private validateDates(dto: CreateBookingDto): string[] {
    const errors = [];
    const arrival: Moment = utc(dto.arrival, DATE_FORMAT);
    const departure: Moment = utc(dto.departure, DATE_FORMAT);

    const isIncludingPeriod = (): boolean => {
      const diff: number = departure.diff(arrival, 'days');
      return diff > 0;
    };

    const isArrivalWithinPeriod = (): boolean => {
      const startLimit = utc();
      const endLimit = utc().add(1, 'year').subtract(1, 'day');
      return arrival.isBetween(startLimit, endLimit, 'days', '[]');
    };

    const isDepartureWithinPeriod = (): boolean => {
      const startLimit = utc().add(1, 'day');
      const endLimit = utc().add(1, 'year');
      return departure.isBetween(startLimit, endLimit, 'days', '[]');
    };

    if (!isIncludingPeriod()) {
      errors.push(
        'There should be at least 1 day diff between arrival and departure',
      );
    }

    if (!isArrivalWithinPeriod()) {
      errors.push(`Arrival date is out of limit`);
    }

    if (!isDepartureWithinPeriod()) {
      errors.push(`Departure date is out of limit`);
    }

    return errors;
  }
}
