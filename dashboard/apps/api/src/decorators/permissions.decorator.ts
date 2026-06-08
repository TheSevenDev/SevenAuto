/* eslint-disable @typescript-eslint/no-explicit-any */
import { applyDecorators, SetMetadata, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { DECORATORS } from '@nestjs/swagger/dist/constants';
import { OperationObject } from '@nestjs/swagger/dist/interfaces/open-api-spec.interface';
import { PermissionsGuard } from 'src/guards/permissions.guard';

export const Permissions =
  (...permissions: string[]): any =>
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
        ApiOperation({ summary: `[Permissions: ${permissions.join(', ')}]` })(
          target,
          key,
          descriptor,
        );
      } else {
        operation.summary = `[Permissions: ${permissions.join(', ')}]${operation.summary ? ' - ' + operation.summary : ''}`;
      }

      applyDecorators(
        ApiBearerAuth(),
        SetMetadata('permissions', permissions),
        UseGuards(PermissionsGuard),
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
              summary: `[Permissions: ${permissions.join(', ')}]`,
            })(target.prototype, methodName, methodDescriptor);
          } else {
            operation.summary = `[Permissions: ${permissions.join(', ')}]${operation.summary ? ' - ' + operation.summary : ''}`;
          }

          applyDecorators(
            ApiBearerAuth(),
            SetMetadata('permissions', permissions),
            UseGuards(PermissionsGuard),
          )(target.prototype, methodName, methodDescriptor);
        }
      });
    }
  };
