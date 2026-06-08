export interface IDotEnv {
  APP_NODE_ENV: string;
  APP_NAME: string;
  API_URL: string;
  BASE_URL: string;
  ASSETS_URL: string;
  SERVER_IP: string;
  PORT: number;
  API_VERSION: string;
  APP_SECRET: string;
  APP_SERVICE_SECRET: string;

  // Token expire time
  ACCESS_TOKEN_EXPIRE_TIME: number;
  REFRESH_TOKEN_EXPIRE_TIME: number;
  VERIFY_TOKEN_EXPIRE_TIME: number;

  //Setting
  PRISMA_LOG: boolean;
  GOOGLE_LOG: boolean;
  GOOGLE_LOG_NAME: string;
  GOOGLE_PROJECT_ID: string;

  // Swagger
  SWAGGER_LOCKED: boolean;
  SWAGGER_USER: string;
  SWAGGER_PASSWORD: string;
  SWAGGER_OPEN: boolean;

  //Database
  DATABASE_URL: string;
  DATABASE_HOST: string;
  DATABASE_PORT: number;
  DATABASE_DATABASE: string;
  DATABASE_USER: string;
  DATABASE_PASSWORD: string;

  //Redis
  REDIS_HOST: string;
  REDIS_PORT: number;
  REDIS_PASSWORD: string;
  REDIS_URL_PREFIX: string;

  //S3
  S3_ENDPOINT: string;
  S3_API_VERSION: string;
  S3_ACCESSKEYID: string;
  S3_SECRETACCESSKEY: string;
  S3_REGION: string;
  S3_BUCKET: string;
  S3_PREFIX: string;
  MEDIA_SECRET: string;
  MEDIA_ALLOWED_VIDEO: boolean;
  MEDIA_ALLOWED_FILE: boolean;
  MEDIA_UPLOAD_PREFIX: string;

  // Email
  EMAIL_ENABLED: boolean;
  EMAIL_HOST: string;
  EMAIL_PORT: number;
  EMAIL_USER: string;
  EMAIL_PASS: string;
  EMAIL_NAME: string;
  EMAIL_REPLY: string;
  EMAIL_SECURE: boolean;

  //queues
  QUEUES_PORT: number;
  QUEUES_PATH: string;
  QUEUES_LOCKED: boolean;
  QUEUES_USER: string;
  QUEUES_PASSWORD: string;
}
