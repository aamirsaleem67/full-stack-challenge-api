import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  MongooseModuleOptions,
  MongooseOptionsFactory,
} from '@nestjs/mongoose';
import { DATABASE_CONFIG, IDatabaseConfig } from '../config/database.config';
import {
  EnvConfigEnum,
  ENV_CONFIG,
  IEnvConfig,
} from '../config/environment.config';

@Injectable()
export class DatabaseConfigService implements MongooseOptionsFactory {
  constructor(private readonly configService: ConfigService) {}

  createMongooseOptions(): MongooseModuleOptions {
    const dbConfig: IDatabaseConfig = this.configService.get(DATABASE_CONFIG);
    const { nodeEnv }: IEnvConfig = this.configService.get(ENV_CONFIG);

    const uri =
      nodeEnv === EnvConfigEnum.TEST
        ? dbConfig.mongodbTestUri
        : dbConfig.mongodbUri;

    return {
      uri,
    };
  }
}
