import {inject, injectable} from 'inversify';
import * as mosca from 'mosca';
import * as moment from 'moment';
import {ServerOpts} from 'mosca';
import TYPES from '../constants/identifiers';
import {LoggerService} from './logger.service';
import {MessageService} from './message.service';
import {MqttClient} from '../models/mqtt-client';

@injectable()
export class MqttService {
  private MQTT_PORT: number = 1883;
  private LOGGER: LoggerService;
  private messageService: MessageService;

  constructor(@inject(TYPES.LoggerService) loggerService: LoggerService,
              @inject(TYPES.MessageService) messageService: MessageService) {
    this.LOGGER = loggerService;
    this.messageService = messageService;
  }

  public start(): void {

    this.LOGGER.info('Starting MQTT Server on port ' + this.MQTT_PORT);
    // connection: 'moscaSettingsMongoDB',
    //
    //   start: function (cb) {
    //
    //   sails.mosca = require('mosca');
    //
    var ascoltatore = {
      //using ascoltatore
      type: 'mongo',
      url: 'mongodb://localhost:27017/mqtt',
      pubsubCollection: 'ascoltatori',
      mongo: {}
    };

    let config: ServerOpts = {
      allowNonSecure: true,
      port: this.MQTT_PORT
    };

    var mqtt = new mosca.Server(config);

    mqtt.on('clientConnected', (client: MqttClient) => this.onClientConnected(client));
    mqtt.on('clientDisconnected', (client: MqttClient) => this.onClientDisconnected(client));
    mqtt.on('published', (packet: any, client: MqttClient) => this.onPublished(packet, client));
  }

  private onClientConnected(client: MqttClient): void {
    this.LOGGER.debug('MQTT client "' + client.id + '" connected.');
  }

  private onClientDisconnected(client: MqttClient): void {
    this.LOGGER.debug('MQTT client "' + client.id + '" disconnected.');
  }

  private onPublished(packet: any, client: MqttClient): void {
    this.LOGGER.debug('MQTT client "' + (client? client.toString() : 'undefined') + '" published packet ' + JSON.stringify(packet));
    this.messageService.handleMessage(moment(), client, packet)
  }
}
