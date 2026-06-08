import { applyDecorators } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsObject, IsOptional } from 'class-validator';
import { UserMetaDto } from 'src/modules/user/dto/userMeta.dto';
import { transformArray } from 'src/transform/transform.array';

import { userMetaResponseExample } from './response.example';

export const ApiUserMetaOptional = () => {
  return applyDecorators(
    ApiProperty({
      type: () => UserMetaDto,
      example: userMetaResponseExample,
      required: false,
    }),
    IsObject(),
    IsOptional(),
  );
};

export const ApiUserMetaRequired = () => {
  return applyDecorators(
    ApiProperty({
      type: () => UserMetaDto,
      example: userMetaResponseExample,
      required: true,
    }),
    IsObject(),
  );
};

export const ApiUserMetaArrayOptional = () => {
  return applyDecorators(
    ApiProperty({
      type: () => [UserMetaDto],
      example: [userMetaResponseExample],
      required: false,
    }),
    IsObject(),
    IsOptional(),
    Transform(({ value }) => transformArray(value)),
  );
};
