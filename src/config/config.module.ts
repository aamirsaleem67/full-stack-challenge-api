import { Module } from '@nestjs/common';
import { ConfigModule as NESTJSConfigModule } from '@nestjs/config';
import { databaseConfig } from './database.config';
import { envConfig } from './environment.config';
import { validationSchema } from './validation';

@Module({
  imports: [
    NESTJSConfigModule.forRoot({
      isGlobal: true,
      load: [envConfig, databaseConfig],
      validationSchema,
      validationOptions: {
        abortEarly: true,
      },
    }),
  ],
})
export class ConfigModule {}
