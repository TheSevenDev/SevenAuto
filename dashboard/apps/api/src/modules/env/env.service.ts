import * as envalid from 'envalid';
import { IDotEnv } from './env.interface';
import { Injectable } from '@nestjs/common';
import { transformBoolean } from 'src/transform/transform.boolean';

@Injectable()
export class EnvService {
  private readonly env: IDotEnv;
  constructor() {
    this.env = this.validate();
  }

  get APP_NODE_ENV(): string {
    return this.env.APP_NODE_ENV;
  }

  get APP_NAME(): string {
    return this.env.APP_NAME;
  }

  get API_URL(): string {
    return this.env.API_URL;
  }

  get BASE_URL(): string {
    return this.env.BASE_URL;
  }

  get ASSETS_URL(): string {
    return this.env.ASSETS_URL;
  }

  get SERVER_IP(): string {
    return this.env.SERVER_IP;
  }

  get PORT(): number {
    return Number(this.env.PORT);
  }

  get API_VERSION(): string {
    return this.env.API_VERSION;
  }

  get APP_SECRET(): string {
    return this.env.APP_SECRET;
  }

  get APP_SERVICE_SECRET(): string {
    return this.env.APP_SERVICE_SECRET;
  }

  // Token expire time
  get ACCESS_TOKEN_EXPIRE_TIME(): number {
    return Number(this.env.ACCESS_TOKEN_EXPIRE_TIME);
  }

  get REFRESH_TOKEN_EXPIRE_TIME(): number {
    return Number(this.env.REFRESH_TOKEN_EXPIRE_TIME);
  }
  get VERIFY_TOKEN_EXPIRE_TIME(): number {
    return Number(this.env.VERIFY_TOKEN_EXPIRE_TIME);
  }

  //Setting
  get PRISMA_LOG(): boolean {
    return transformBoolean(this.env.PRISMA_LOG);
  }

  get GOOGLE_LOG(): boolean {
    return transformBoolean(this.env.GOOGLE_LOG);
  }

  get GOOGLE_LOG_NAME(): string {
    return this.env.GOOGLE_LOG_NAME;
  }

  get GOOGLE_PROJECT_ID(): string {
    return this.env.GOOGLE_PROJECT_ID;
  }

  // Swagger
  get SWAGGER_LOCKED(): boolean {
    return transformBoolean(this.env.SWAGGER_LOCKED);
  }

  get SWAGGER_USER(): string {
    return this.env.SWAGGER_USER;
  }

  get SWAGGER_PASSWORD(): string {
    return this.env.SWAGGER_PASSWORD;
  }

  get SWAGGER_OPEN(): boolean {
    return transformBoolean(this.env.SWAGGER_OPEN);
  }

  //database
  get DATABASE_URL(): string {
    return this.env.DATABASE_URL;
  }

  get MYSQL_HOST(): string {
    return this.env.MYSQL_HOST;
  }

  get MYSQL_PORT(): number {
    return Number(this.env.MYSQL_PORT);
  }

  get MYSQL_DATABASE(): string {
    return this.env.MYSQL_DATABASE;
  }

  get MYSQL_USER(): string {
    return this.env.MYSQL_USER;
  }

  get MYSQL_PASSWORD(): string {
    return this.env.MYSQL_PASSWORD;
  }

  //Redis
  get REDIS_URL(): string {
    const host = this.REDIS_HOST || 'localhost';
    const port = this.REDIS_PORT || 6379;
    const password = this.REDIS_PASSWORD || '';
    return password
      ? `redis://:${password}@${host}:${port}`
      : `redis://${host}:${port}`;
  }

  get REDIS_PORT(): number {
    return Number(this.env.REDIS_PORT) || 6379;
  }

  get REDIS_HOST(): string {
    return this.env.REDIS_HOST || 'localhost';
  }

  get REDIS_PASSWORD(): string {
    return this.env.REDIS_PASSWORD || '';
  }

  get REDIS_URL_PREFIX(): string {
    return this.env.REDIS_URL_PREFIX;
  }

  //S3
  get S3_ENDPOINT(): string {
    return this.env.S3_ENDPOINT;
  }

  get S3_API_VERSION(): string {
    return this.env.S3_API_VERSION;
  }

  get S3_ACCESSKEYID(): string {
    return this.env.S3_ACCESSKEYID;
  }

  get S3_SECRETACCESSKEY(): string {
    return this.env.S3_SECRETACCESSKEY;
  }

  get S3_PREFIX(): string {
    return this.env.S3_PREFIX;
  }

  get S3_REGION(): string {
    return this.env.S3_REGION;
  }

  get S3_BUCKET(): string {
    return this.env.S3_BUCKET;
  }

  get MEDIA_SECRET(): string {
    return this.env.MEDIA_SECRET;
  }

  get MEDIA_ALLOWED_VIDEO(): boolean {
    return transformBoolean(this.env.MEDIA_ALLOWED_VIDEO);
  }

  get MEDIA_ALLOWED_FILE(): boolean {
    return transformBoolean(this.env.MEDIA_ALLOWED_FILE);
  }

  get MEDIA_UPLOAD_PREFIX(): string {
    return this.env.MEDIA_UPLOAD_PREFIX;
  }

  get EMAIL_ENABLED(): boolean {
    return transformBoolean(this.env.EMAIL_ENABLED);
  }

  get EMAIL_HOST(): string {
    return this.env.EMAIL_HOST;
  }

  get EMAIL_PORT(): number {
    return Number(this.env.EMAIL_PORT);
  }

  get EMAIL_USER(): string {
    return this.env.EMAIL_USER;
  }

  get EMAIL_PASS(): string {
    return this.env.EMAIL_PASS;
  }

  get EMAIL_NAME(): string {
    return this.env.APP_NAME;
  }

  get EMAIL_REPLY(): string {
    return this.env.EMAIL_REPLY;
  }

  get EMAIL_SECURE(): boolean {
    return transformBoolean(this.env.EMAIL_SECURE);
  }

  //queues
  get QUEUES_PORT(): number {
    return Number(this.env.QUEUES_PORT);
  }

  get QUEUES_PATH(): string {
    return this.env.QUEUES_PATH;
  }

  get QUEUES_LOCKED(): boolean {
    return transformBoolean(this.env.QUEUES_LOCKED);
  }

  get QUEUES_USER(): string {
    return this.env.QUEUES_USER;
  }

  get QUEUES_PASSWORD(): string {
    return this.env.QUEUES_PASSWORD;
  }

  validate(): IDotEnv {
    const rule = {
      APP_NODE_ENV: envalid.str(),
      APP_NAME: envalid.str(),
      API_URL: envalid.str(),
      BASE_URL: envalid.str(),
      ASSETS_URL: envalid.str(),
      SERVER_IP: envalid.str(),
      PORT: envalid.num(),
      API_VERSION: envalid.str(),
      APP_SECRET: envalid.str(),
      APP_SERVICE_SECRET: envalid.str(),

      // Token expire time
      ACCESS_TOKEN_EXPIRE_TIME: envalid.num(),
      REFRESH_TOKEN_EXPIRE_TIME: envalid.num(),
      VERIFY_TOKEN_EXPIRE_TIME: envalid.num(),

      //Setting
      PRISMA_LOG: envalid.bool(),
      GOOGLE_LOG: envalid.bool(),
      GOOGLE_LOG_NAME: envalid.str(),
      GOOGLE_PROJECT_ID: envalid.str(),

      // Swagger
      SWAGGER_USER: envalid.str(),
      SWAGGER_PASSWORD: envalid.str(),
      SWAGGER_OPEN: envalid.bool(),
      SWAGGER_LOCKED: envalid.bool(),

      //Database
      DATABASE_URL: envalid.str(),
      MYSQL_HOST: envalid.str(),
      MYSQL_PORT: envalid.num(),
      MYSQL_DATABASE: envalid.str(),
      MYSQL_USER: envalid.str(),
      MYSQL_PASSWORD: envalid.str(),

      //Redis
      REDIS_PORT: envalid.num(),
      REDIS_HOST: envalid.str(),
      REDIS_PASSWORD: envalid.str(),
      REDIS_URL_PREFIX: envalid.str(),

      //S3
      S3_ENDPOINT: envalid.str(),
      S3_API_VERSION: envalid.str(),
      S3_ACCESSKEYID: envalid.str(),
      S3_SECRETACCESSKEY: envalid.str(),
      S3_REGION: envalid.str(),
      S3_BUCKET: envalid.str(),
      S3_PREFIX: envalid.str(),
      MEDIA_SECRET: envalid.str(),
      MEDIA_ALLOWED_VIDEO: envalid.bool(),
      MEDIA_ALLOWED_FILE: envalid.bool(),
      MEDIA_UPLOAD_PREFIX: envalid.str(),

      // Email
      EMAIL_ENABLED: envalid.bool(),
      EMAIL_HOST: envalid.str(),
      EMAIL_PORT: envalid.num(),
      EMAIL_USER: envalid.str(),
      EMAIL_PASS: envalid.str(),
      EMAIL_NAME: envalid.str(),
      EMAIL_REPLY: envalid.str(),
      EMAIL_SECURE: envalid.bool(),

      //queues
      QUEUES_PORT: envalid.num(),
      QUEUES_PATH: envalid.str(),
      QUEUES_LOCKED: envalid.bool(),
      QUEUES_USER: envalid.str(),
      QUEUES_PASSWORD: envalid.str(),
    };

    return envalid.cleanEnv(process.env, rule);
  }
}
