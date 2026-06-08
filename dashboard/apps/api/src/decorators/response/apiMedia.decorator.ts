import { applyDecorators } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { IsObject, IsOptional } from 'class-validator';
import { MediaDto } from 'src/modules/media/dto/media.dto';

import { mediaResponseExample } from './response.example';

export const ApiMediaOptional = () => {
  return applyDecorators(
    ApiProperty({
      type: () => MediaDto,
      example: mediaResponseExample,
      required: false,
    }),
    IsObject(),
    IsOptional(),
  );
};

export const ApiMediaRequired = () => {
  return applyDecorators(
    ApiProperty({
      type: () => MediaDto,
      example: mediaResponseExample,
      required: true,
    }),
    IsObject(),
  );
};
