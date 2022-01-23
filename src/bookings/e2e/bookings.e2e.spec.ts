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
import { FindBookingsQueryDto } from '../dto/find-bookings-query.dto';
import { DATE_FORMAT } from '../../shared/constants';

jest.setTimeout(100000);
describe('Bookings', () => {
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

  beforeEach(async () => {
    await dbConnection.collection('bookings').deleteMany({});
  });

  afterAll(async () => {
    await dbConnection.dropDatabase();
    await dbConnection.close();
    await app.close();
  });

  describe('test dependencies', () => {
    it('db connection should be defined', () => {
      expect(dbConnection).toBeDefined();
    });
  });

  describe('REST API', () => {
    describe('POST /bookings', () => {
      const dto: CreateBookingDto = createBookingStub();

      it('should create a booking', async () => {
        const { _id } = await request(app.getHttpServer())
          .post('/bookings')
          .send(dto)
          .expect(HttpStatus.CREATED)
          .then((res) => res.body);
        expect(_id).toBeDefined();
      });

      it(`should throw ${HttpStatus.CONFLICT} error if booking already exist`, async () => {
        const dto: CreateBookingDto = createBookingStub();
        await request(app.getHttpServer())
          .post('/bookings')
          .send(dto)
          .expect(HttpStatus.CREATED);

        await request(app.getHttpServer())
          .post('/bookings')
          .send(dto)
          .expect(HttpStatus.CONFLICT);
      });
    });

    describe('GET /bookings', () => {
      beforeEach(async () => {
        await request(app.getHttpServer())
          .post('/bookings')
          .send(createBookingStub())
          .expect(HttpStatus.CREATED);
        await request(app.getHttpServer())
          .post('/bookings')
          .send(
            createBookingStub(
              utc().add(3, 'days').format(DATE_FORMAT),
              utc().add(5, 'days').format(DATE_FORMAT),
            ),
          )
          .expect(HttpStatus.CREATED);
      });

      it(`should return all bookings`, async () => {
        const bookings = await request(app.getHttpServer())
          .get('/bookings')
          .expect(HttpStatus.OK)
          .then((res) => res.body);
        expect(bookings.length).toEqual(2);
      });

      it(`should return filtered bookings`, async () => {
        const bookings = await request(app.getHttpServer())
          .get('/bookings')
          .query(<FindBookingsQueryDto>{
            arrival: utc().add(3, 'days').format(DATE_FORMAT),
          })
          .expect(HttpStatus.OK)
          .then((res) => res.body);
        expect(bookings.length).toEqual(1);
        expect(bookings[0].arrival).toEqual(
          utc().add(3, 'days').startOf('day').toISOString(),
        );
        expect(bookings[0].departure).toEqual(
          utc().add(5, 'days').startOf('day').toISOString(),
        );
      });
    });
  });
});
