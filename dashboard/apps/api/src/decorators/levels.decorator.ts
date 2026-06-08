/* eslint-disable @typescript-eslint/no-explicit-any */
import { applyDecorators, SetMetadata, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { DECORATORS } from '@nestjs/swagger/dist/constants';
import { OperationObject } from '@nestjs/swagger/dist/interfaces/open-api-spec.interface';
import { EUserLevel } from '@seven-auto/libs';
import { LevelsGuard } from 'src/guards/levels.guard';

export const Levels =
  (...levels: EUserLevel[]): any =>
  (
    target: Record<string, any>,
    key?: string | symbol,
    descriptor?: TypedPropertyDescriptor<any>,
  ): void => {
    if (descriptor) {
      // Decorator applied to a method
      const operation: OperationObject = Reflect.getMetadata(
        DECORATORS.API_OPERATION,
        descriptor.value,
      );

      if (!operation) {
        ApiOperation({
          summary: `[Levels: ${levels.map((level) => level.toString()).join(', ')}]`,
        })(target, key, descriptor);
      } else {
        operation.summary = `[Levels: ${levels.map((level) => level.toString()).join(', ')}]${operation.summary ? ' - ' + operation.summary : ''}`;
      }

      applyDecorators(
        ApiBearerAuth(),
        SetMetadata('levels', levels),
        UseGuards(LevelsGuard),
      )(target, key, descriptor);
    } else {
      // Decorator applied to a class
      const classMethods = Object.getOwnPropertyNames(target.prototype).filter(
        (prop) =>
          prop !== 'constructor' &&
          typeof target.prototype[prop] === 'function',
      );

      classMethods.forEach((methodName) => {
        const methodDescriptor = Object.getOwnPropertyDescriptor(
          target.prototype,
          methodName,
        );

        if (methodDescriptor) {
          const operation: OperationObject = Reflect.getMetadata(
            DECORATORS.API_OPERATION,
            methodDescriptor.value,
          );

          if (!operation) {
            ApiOperation({
              summary: `[Levels: ${levels.map((level) => level.toString()).join(', ')}]`,
            })(target.prototype, methodName, methodDescriptor);
          } else {
            operation.summary = `[Levels: ${levels.map((level) => level.toString()).join(', ')}]${operation.summary ? ' - ' + operation.summary : ''}`;
          }

          applyDecorators(
            ApiBearerAuth(),
            SetMetadata('levels', levels),
            UseGuards(LevelsGuard),
          )(target.prototype, methodName, methodDescriptor);
        }
      });
    }
  };
