import { Module } from '@nestjs/common';
import { EnvModule } from 'src/modules/env/env.module';

import { WebsocketController } from './websocket.controller';
import { WebSocketsGateway } from './websocket.gateway';
import { WebsocketService } from './websocket.service';

@Module({
  imports: [EnvModule],
  controllers: [WebsocketController],
  providers: [
    {
      provide: WebsocketService,
      useClass: WebsocketService,
    },
    {
      provide: WebSocketsGateway,
      useClass: WebSocketsGateway,
    },
  ],
  exports: [WebsocketService, WebSocketsGateway],
})
export class WebsocketModule {}
