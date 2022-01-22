import { registerAs } from '@nestjs/config';

export interface IDatabaseConfig {
  mongodbUri: string;
  mongodbTestUri: string;
}
export const DATABASE_CONFIG = 'DATABASE_CONFIG';

export const databaseConfig = registerAs(DATABASE_CONFIG, () => {
  const {
    env: { MONGODB_URI, MONGODB_TEST_URI },
  } = process;

  return {
    mongodbUri: MONGODB_URI,
    mongodbTestUri: MONGODB_TEST_URI,
  };
});
