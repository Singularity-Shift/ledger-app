import * as dotenv from 'dotenv';

dotenv.config();

export const Profiles = {
  development: {
    nodeEnv: process.env.NODE_ENV,
    autoBackendApi: {
      url: process.env.AUTO_BACKEND_URL,
      port: process.env.AUTO_BACKEND_PORT,
    },
    ledgerApp: {
      url: process.env.LEDGER_APP_URL,
    },
    jwt: {
      secret: process.env.JWT_SECRET_KEY,
      expiredTime: process.env.JWT_EXPIRED_TIME,
    },
    openApi: {
      apiKey: process.env.OPENAI_API_KEY,
    },
    serverAccount: {
      key: process.env.PRIVATE_KEY_SERVER,
    },
    storage: {
      project_id: process.env.PROJECT_ID,
      storageCredentials: process.env.STORAGE_CREDENTIALS,
    },
    devMode: process.env.VITE_DEV_MODE,
  },
  production: {
    nodeEnv: process.env.NODE_ENV,
    autoBackendApi: {
      url: process.env.URL,
      port: process.env.PORT,
    },
    ledgerApp: {
      url: process.env.URL,
    },
    jwt: {
      secret: process.env.JWT_SECRET_KEY,
      expiredTime: process.env.JWT_EXPIRED_TIME,
    },
    openApi: {
      apiKey: process.env.OPENAI_API_KEY,
    },
    serverAccount: {
      key: process.env.PRIVATE_KEY_SERVER,
    },
    storage: {
      project_id: process.env.PROJECT_ID,
      storageCredentials: process.env.STORAGE_CREDENTIALS,
    },
    devMode: process.env.VITE_DEV_MODE || false,
  },
};
