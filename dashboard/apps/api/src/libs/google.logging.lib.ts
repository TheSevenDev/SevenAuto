import { Injectable } from '@nestjs/common';
import { EnvService } from 'src/modules/env/env.service';

type CloudLog = ReturnType<
  InstanceType<typeof import('@google-cloud/logging').Logging>['log']
>;

@Injectable()
class GoogleLogging {
  private log: CloudLog | undefined;
  private readonly envService = new EnvService();
  private clientReady: Promise<void> | undefined;

  private async ensureClient(): Promise<void> {
    if (!this.envService.GOOGLE_LOG) return;
    if (this.log) return;

    if (!this.clientReady) {
      this.clientReady = (async () => {
        const { Logging } = await import('@google-cloud/logging');
        const logging = new Logging();
        this.log = logging.log(this.envService.GOOGLE_LOG_NAME);
      })();
    }

    await this.clientReady;
  }

  baseLog = async (
    type: 'ERROR' | 'WARN' | 'INFO' | 'DEBUG' | 'VERBOSE',
    message: string,
    context?: string,
    trace?: string,
  ): Promise<void> => {
    if (!this.envService.GOOGLE_LOG) return;
    await this.ensureClient();
    if (!this.log) return;

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
