import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './app.module';
import { PongDto } from './dtos/pong.dto';
import { DatabaseService } from './database/database.service';
import { Connection } from 'mongoose';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let dbConnection: Connection;

  beforeAll(async () => {
    const container: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = container.createNestApplication();
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

  it('/ (GET)', () => {
    return request(app.getHttpServer())
      .get('/app/ping')
      .expect(200)
      .then((res) => res.body)
      .then((dto: PongDto) => {
        expect(dto.text).toEqual('pong');
      });
  });
});
