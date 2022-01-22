import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { DATABASE_CONFIG, IDatabaseConfig } from 'src/config/database.config';
import {
  EnvConfigEnum,
  ENV_CONFIG,
  IEnvConfig,
} from 'src/config/environment.config';

import { DatabaseService } from './database.service';

@Module({
  imports: [
    MongooseModule.forRootAsync({
      useFactory: (configService: ConfigService) => {
        const dbConfig: IDatabaseConfig = configService.get(DATABASE_CONFIG);
        const { nodeEnv }: IEnvConfig = configService.get(ENV_CONFIG);
        const uri =
          nodeEnv === EnvConfigEnum.TEST
            ? dbConfig.mongodbTestUri
            : dbConfig.mongodbUri;

        return {
          uri,
        };
      },
      inject: [ConfigService],
    }),
  ],
  providers: [DatabaseService],
  exports: [DatabaseService],
})
export class DatabaseModule {}
