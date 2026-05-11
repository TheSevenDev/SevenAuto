import {
  ConsoleLogger,
  LoggerService as NestLoggerService,
} from '@nestjs/common';
import { GoogleLogging } from 'src/libs/google.logging.lib';

export class LoggerService extends ConsoleLogger implements NestLoggerService {
  private readonly googleLogging = new GoogleLogging();
  async log(message: string, context?: string): Promise<void> {
    super.log(message, context);
    await this.googleLogging.baseLog('INFO', message, context);
  }

  async error(message: string, trace: string, context?: string): Promise<void> {
    super.error(message, trace, context);
    await this.googleLogging.baseLog('ERROR', message, context, trace);
  }

  async warn(message: string, context?: string): Promise<void> {
    super.warn(message, context);
    await this.googleLogging.baseLog('WARN', message, context);
  }

  async debug(message: string, context?: string): Promise<void> {
    super.debug(message, context);
    await this.googleLogging.baseLog('DEBUG', message, context);
  }

  async verbose(message: string, context?: string): Promise<void> {
    super.verbose(message, context);
    await this.googleLogging.baseLog('VERBOSE', message, context);
  }
}
