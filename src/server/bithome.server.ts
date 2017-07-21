import 'reflect-metadata';
import {interfaces, InversifyExpressServer, TYPE} from 'inversify-express-utils';
import {Container} from 'inversify';
import {makeLoggerMiddleware} from 'inversify-logger-middleware';
import * as bodyParser from 'body-parser';
import * as helmet from 'helmet';
import * as http from 'http';
import {HomeController} from './controller/home.controller';
import {UserController} from './controller/user.controller';
import {MongoDBClient} from './client/mongodb.client';
import {UserService} from './service/user.service';
import TAGS from './constants/tags';
import TYPES from './constants/identifiers';
import {MqttService} from './service/mqtt.service';
import {LoggerService} from './service/logger.service';
import {MessageService} from './service/message.service';
import {SocketService} from './service/socket.service';
import {NodeService} from './service/node.service';
import express = require("express");
import path = require("path");
import {DeserializeKeysFrom, UnderscoreCase, SerializeKeysTo} from 'cerialize';
import {Application} from 'express';
var fallback = require('express-history-api-fallback');

export class BitHomeServer {

  constructor() {
  }

  public run(): void {

    // load everything needed to the kernel
    var container = new Container();

    if (process.env.NODE_ENV === 'development') {
      let logger = makeLoggerMiddleware();
      container.applyMiddleware((logger as any));
    }

    container.bind<interfaces.Controller>(TYPE.Controller).to(HomeController).whenTargetNamed(TAGS.HomeController);
    container.bind<interfaces.Controller>(TYPE.Controller).to(UserController).whenTargetNamed(TAGS.UserController);
    container.bind<MongoDBClient>(TYPES.MongoDBClient).to(MongoDBClient).inSingletonScope();
    container.bind<LoggerService>(TYPES.LoggerService).to(LoggerService).inSingletonScope();
    container.bind<SocketService>(TYPES.SocketService).to(SocketService).inSingletonScope();
    container.bind<MessageService>(TYPES.MessageService).to(MessageService).inSingletonScope();
    container.bind<UserService>(TYPES.UserService).to(UserService).inSingletonScope();
    container.bind<MqttService>(TYPES.MqttService).to(MqttService).inSingletonScope();
    container.bind<NodeService>(TYPES.NodeService).to(NodeService).inSingletonScope();

    var LOGGER: LoggerService = container.get<LoggerService>(TYPES.LoggerService);

    var socketService: SocketService = container.get<SocketService>(TYPES.SocketService);
    var mqttService: MqttService = container.get<MqttService>(TYPES.MqttService);

    DeserializeKeysFrom(UnderscoreCase);
    SerializeKeysTo(UnderscoreCase);

    // start the server
    let server = new InversifyExpressServer(container);
    server.setConfig((app: Application) => {
      app.use(bodyParser.urlencoded({
        extended: true
      }));
      app.use(bodyParser.json());
      app.use(helmet());
      app.use(express.static(__dirname + '/../client'));
      app.use('/node_modules', express.static(__dirname + '/../../../node_modules'));
      app.use(/^\/(?!(api)).*/, fallback(path.resolve(__dirname + '/../client/index.html')));
    });

    let app = server.build();

    let httpServer = http.createServer(app);

    httpServer.listen(3000);

    /**
     * Start services
     */
    socketService.start(httpServer);
    mqttService.start();

    LOGGER.info('BitHome Server started on port 3000');

    exports = module.exports = app;

  }
}
