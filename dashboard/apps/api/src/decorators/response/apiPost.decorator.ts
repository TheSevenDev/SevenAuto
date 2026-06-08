import { applyDecorators } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsObject, IsOptional } from 'class-validator';
import { PostDto } from 'src/modules/post/dto/post.dto';

import { postResponseExample } from './response.example';

export const ApiPostOptional = () => {
  return applyDecorators(
    ApiProperty({
      type: () => PostDto,
      example: postResponseExample,
      required: false,
    }),
    IsObject(),
    IsOptional(),
  );
};

export const ApiPostRequired = () => {
  return applyDecorators(
    ApiProperty({
      type: () => PostDto,
      example: postResponseExample,
      required: true,
    }),
    IsObject(),
  );
};

export const ApiPostArrayOptional = () => {
  return applyDecorators(
    ApiProperty({
      type: () => [PostDto],
      example: [postResponseExample],
      required: false,
    }),
    IsArray(),
    IsOptional(),
  );
};
