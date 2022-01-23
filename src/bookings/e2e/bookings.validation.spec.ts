import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { Connection } from 'mongoose';
import { ConfigModule } from '../../config/config.module';
import { DatabaseModule } from '../../database/database.module';
import { DatabaseService } from '../../database/database.service';
import { BookingsModule } from '../bookings.module';
import { CreateBookingDto } from '../dto/create-booking.dto';
import * as request from 'supertest';
import { createBookingStub } from './stubs/booking.stub';
import { utc } from 'moment';
import { DATE_FORMAT } from '../../shared/constants';
import { FindBookingsQueryDto } from '../dto/find-bookings-query.dto';

jest.setTimeout(100000);
describe('Bookings Validation', () => {
  let app: INestApplication;
  let container: TestingModule;
  let dbConnection: Connection;

  beforeAll(async () => {
    container = await Test.createTestingModule({
      imports: [ConfigModule, DatabaseModule, BookingsModule],
    }).compile();

    app = container.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ transform: true }));
    await app.init();

    dbConnection = container
      .get<DatabaseService>(DatabaseService)
      .getDbHandle();
  });

  afterAll(async () => {
    await dbConnection.dropDatabase();
    await dbConnection.close();
    await app.close();
  });

  describe('REST API', () => {
    describe('POST /bookings', () => {
      it('should not create a booking if booker is missing', () => {
        return request(app.getHttpServer())
          .post('/bookings')
          .send({
            arrival: utc().format(DATE_FORMAT),
            departure: utc().add(1, 'day').format(DATE_FORMAT),
            adults: 2,
          })
          .expect(HttpStatus.BAD_REQUEST);
      });

      it('should not create a booking if arrival date format is wrong', () => {
        const dto: CreateBookingDto = createBookingStub();

        return request(app.getHttpServer())
          .post('/bookings')
          .send({
            ...dto,
            arrival: utc().format('MM-DD-YYYY'),
          })
          .expect(HttpStatus.BAD_REQUEST);
      });

      it('should not create a booking if departure date format is wrong', () => {
        const dto: CreateBookingDto = createBookingStub();

        return request(app.getHttpServer())
          .post('/bookings')
          .send({
            ...dto,
            departure: utc().format('MM-DD-YYYY'),
          })
          .expect(HttpStatus.BAD_REQUEST);
      });

      it('should not create a booking if adults is equals to 0', () => {
        const dto: CreateBookingDto = createBookingStub();

        return request(app.getHttpServer())
          .post('/bookings')
          .send({
            ...dto,
            adults: 0,
          })
          .expect(HttpStatus.BAD_REQUEST);
      });

      it('should not create a booking if number of adults is greater than max limit', () => {
        const dto: CreateBookingDto = createBookingStub();

        return request(app.getHttpServer())
          .post('/bookings')
          .send({
            ...dto,
            adults: 16,
          })
          .expect(HttpStatus.BAD_REQUEST);
      });
    });

    describe('GET /bookings', () => {
      it('should not return bookings if _id is not monoogse object id', () => {
        return request(app.getHttpServer())
          .get('/bookings')
          .query(<FindBookingsQueryDto>{
            _id: '123',
          })
          .expect(HttpStatus.BAD_REQUEST);
      });

      it('should not return bookings if date format is not correct', () => {
        return request(app.getHttpServer())
          .get('/bookings')
          .query(<FindBookingsQueryDto>{
            arrival: utc().format('MM-DD-YYYY'),
            departure: utc().format('MM-DD-YYYY'),
          })
          .expect(HttpStatus.BAD_REQUEST);
      });
    });
  });
});
