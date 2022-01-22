import { registerAs } from '@nestjs/config';

export enum EnvConfigEnum {
  DEVELOPMENT = 'development',
  TEST = 'test',
  PRODUCTION = 'production',
}

export interface IEnvConfig {
  nodeEnv: EnvConfigEnum;
}

export const ENV_CONFIG = 'ENV_CONFIG';

export const envConfig = registerAs(ENV_CONFIG, () => {
  const {
    env: { NODE_ENV },
  } = process;

  return {
    nodeEnv: NODE_ENV as EnvConfigEnum,
  };
});
