/* eslint-disable @typescript-eslint/no-explicit-any */
import { applyDecorators, Type } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiExtraModels,
  ApiOkResponse,
  getSchemaPath,
} from '@nestjs/swagger';

import { SuccessResponseDto } from '../dto/utils.dto';

export const ApiSuccessObjResponse = <TModel extends Type<any>>(
  model: TModel,
) => {
  return applyDecorators(
    ApiExtraModels(SuccessResponseDto, model),
    ApiOkResponse({
      schema: {
        allOf: [
          { $ref: getSchemaPath(SuccessResponseDto) },
          {
            properties: {
              data: {
                type: 'object',
                $ref: getSchemaPath(model),
              },
            },
          },
        ],
      },
    }),
  );
};

export const ApiSuccessArrayResponse = <TModel extends Type<any>>(
  model: TModel,
) => {
  return applyDecorators(
    ApiExtraModels(SuccessResponseDto, model),
    ApiOkResponse({
      schema: {
        allOf: [
          { $ref: getSchemaPath(SuccessResponseDto) },
          {
            properties: {
              data: {
                type: 'array',
                items: {
                  $ref: getSchemaPath(model),
                },
              },
            },
          },
        ],
      },
    }),
  );
};

export const ApiSuccessBooleanResponse = () => {
  return applyDecorators(
    ApiExtraModels(SuccessResponseDto, Boolean),
    ApiOkResponse({
      schema: {
        allOf: [
          { $ref: getSchemaPath(SuccessResponseDto) },
          {
            properties: {
              data: {
                type: 'boolean',
              },
            },
          },
        ],
      },
    }),
  );
};

export const ApiSuccessStringResponse = () => {
  return applyDecorators(
    ApiExtraModels(SuccessResponseDto, String),
    ApiOkResponse({
      schema: {
        allOf: [
          { $ref: getSchemaPath(SuccessResponseDto) },
          {
            properties: {
              data: {
                type: 'string',
              },
            },
          },
        ],
      },
    }),
  );
};

export const ApiSuccessNumberResponse = () => {
  return applyDecorators(
    ApiExtraModels(SuccessResponseDto, Number),
    ApiOkResponse({
      schema: {
        allOf: [
          { $ref: getSchemaPath(SuccessResponseDto) },
          {
            properties: {
              data: {
                type: 'number',
              },
            },
          },
        ],
      },
    }),
  );
};

export const ApiErrorResponse = () => {
  return applyDecorators(
    ApiBadRequestResponse({
      schema: {
        allOf: [
          { $ref: getSchemaPath(SuccessResponseDto) },
          {
            properties: {
              data: {
                type: 'object',
                properties: {
                  statusCode: { type: 'number', example: 400 },
                  message: {
                    type: 'string',
                    example: 'module.type.error_message',
                  },
                  error: { type: 'string', example: 'Bad Request' },
                },
              },
            },
          },
        ],
      },
    }),
  );
};

export const ApiFindManyResponse = <TModel extends Type<any>>(
  model: TModel,
) => {
  return applyDecorators(
    ApiExtraModels(SuccessResponseDto, model),
    ApiOkResponse({
      schema: {
        properties: {
          data: {
            type: 'object',
            properties: {
              items: {
                type: 'array',
                items: {
                  $ref: getSchemaPath(model),
                },
              },
              total: { type: 'number' },
            },
          },
        },
      },
    }),
  );
};
