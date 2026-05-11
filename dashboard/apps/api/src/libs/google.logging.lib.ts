import { EnvService } from 'src/modules/env/env.service';
import { Injectable } from '@nestjs/common';
import { Logging } from '@google-cloud/logging';

@Injectable()
class GoogleLogging {
  private logging;
  private log;
  private readonly envService = new EnvService();

  constructor() {
    if (!this.envService.GOOGLE_LOG) return;
    this.logging = new Logging();
    this.log = this.logging.log(this.envService.GOOGLE_LOG_NAME);
  }

  baseLog = async (
    type: 'ERROR' | 'WARN' | 'INFO' | 'DEBUG' | 'VERBOSE',
    message: string,
    context?: string,
    trace?: string,
  ): Promise<void> => {
    if (!this.envService.GOOGLE_LOG || !this.log) return;
    let text = `[${this.envService.GOOGLE_LOG_NAME}] - `;
    if (context) {
      text += `${context}\n`;
    }

    if (message) {
      const nextmessage =
        typeof message === 'string' ? message : JSON.stringify(message);
      text += nextmessage;
    }
    if (trace) {
      const nextTrace =
        typeof trace === 'string' ? trace : JSON.stringify(trace);
      text += `\n\n📍[ERROR-TRACE] ${nextTrace}\n\n`;
    }

    const metadata = { resource: { type: 'gce_instance' }, severity: type };
    const entry = this.log.entry(metadata, text);
    await this.log.write(entry);
  };
}

export { GoogleLogging };
