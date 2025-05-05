/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Logger } from '@nestjs/common';
import * as Joi from 'joi';
import { get as loGet } from 'lodash';
import { Profiles } from './profiles';
import * as path from 'path';

export interface EnvConfig {
  [key: string]: unknown;
}

const DOTENV_SCHEMA = Joi.object({
  nodeEnv: Joi.string()
    .valid('development', 'production')
    .default('development'),
  openApi: Joi.object({
    apiKey: Joi.string().required(),
  }),
  autoBackendApi: Joi.object({
    url: Joi.string().default('0.0.0.0'),
    port: Joi.string().default('3050'),
  }).default({
    url: '0.0.0.0',
    port: '3050',
  }),
  jwt: Joi.object({
    secret: Joi.string().required(),
    expiredTime: Joi.string().default('31d'),
  }),
  serverAccount: Joi.object({
    key: Joi.string(),
  }),
  ledgerApp: {
    url: Joi.string().default('http://localhost:5173'),
  },
  storage: Joi.object({
    project_id: Joi.string().required(),
    storageCredentials: Joi.string().required(),
  }),
  devMode: Joi.boolean().default(false),
});

type DotenvSchemaKeys =
  | 'nodeEnv'
  | 'openApi.apiKey'
  | 'jwt.secret'
  | 'jwt.expiredTime'
  | 'autoBackendApi.url'
  | 'autoBackendApi.port'
  | 'serverAccount.key'
  | 'ledgerApp.url'
  | 'storage.project_id'
  | 'storage.storageCredentials'
  | 'devMode';

export class ConfigService {
  private readonly envConfig: EnvConfig;
  private readonly logger = new Logger(ConfigService.name);

  constructor() {
    this.envConfig = this.validateInput(
      Profiles[
        (process.env.NODE_ENV as 'development' | 'production') || 'development'
      ],
    );
  }

  get<T>(path: DotenvSchemaKeys): T | undefined {
    return loGet(this.envConfig, path) as unknown as T | undefined;
  }

  private validateInput(envConfig: EnvConfig): EnvConfig {
    const { error, value: validatedEnvConfig } = DOTENV_SCHEMA.validate(
      envConfig,
      {
        allowUnknown: true,
        stripUnknown: true,
      },
    );
    if (error) {
      this.logger.error(
        'Missing configuration please provide followed variable!\n\n',
        'ConfigService',
      );
      this.logger.error(error.message, 'ConfigService');
      process.exit(2);
    }
    return validatedEnvConfig as EnvConfig;
  }
}
