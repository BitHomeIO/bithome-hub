import {inject, injectable} from 'inversify';
import * as moment from 'moment';
import * as socketIo from 'socket.io';
import TYPES from '../constants/identifiers';
import {LoggerService} from './logger.service';
import {MessageService} from './message.service';
import Server = SocketIO.Server;

@injectable()
export class SocketService {
  private SOCKET_PORT: number = 1887;
  private LOGGER: LoggerService;
  private ioServer: Server;

  constructor(@inject(TYPES.LoggerService) loggerService: LoggerService) {
    this.LOGGER = loggerService;
  }

  public start(httpServer: any): void {

    this.LOGGER.info('Starting socket.io Server.');

    this.ioServer = socketIo(httpServer, { path: '/ws' });


    this.ioServer.on('connect', (socket: any) => {
      this.LOGGER.debug('Connected socket client.');
      socket.on('message', (m: any) => {
        this.LOGGER.debug('[server](message): ' + JSON.stringify(m));
        this.ioServer.emit('message', m);
      });

      socket.on('disconnect', () => {
        this.LOGGER.debug('Client disconnected');
      });
    });
  }

  public broadcast(channel: string, message: string): void {
    if (this.ioServer) {
      this.ioServer.emit(channel, message);
    }
  }
}
