import { utc } from 'moment';
import { CreateBookingDto } from 'src/bookings/dto/create-booking.dto';
import { DATE_FORMAT } from '../../../shared/constants';

// For real applications we can use faker to provide testing values
export const createBookingStub = (
  arrival = utc().format(DATE_FORMAT),
  departure = utc().add(1, 'day').format(DATE_FORMAT),
): CreateBookingDto => {
  return {
    booker: {
      firstName: 'test first name',
      lastName: 'test last name',
      email: 'tester@mail.com',
      phone: '+49 1234567',
      address: {
        addressLine1: 'testing address',
        postalCode: '25130',
        countryCode: 'DE',
        city: 'Berlin',
      },
    },
    arrival,
    departure,
    adults: 2,
  };
};
