import {inject, injectable} from 'inversify';
import TYPES from '../constants/identifiers';
import {LoggerService} from './logger.service';
import {Moment} from 'moment';
import * as moment from 'moment';
import {SocketService} from './socket.service';
import {MqttClient} from '../models/mqtt-client';
import {MqttPacket} from '../models/mqtt-packet';
import {NodeService} from './node.service';

@injectable()
export class MessageService {
  private LOGGER: LoggerService;
  private socketService: SocketService;
  private nodeService: NodeService;

  private TOPIC_HUB: string = 'hub';
  private TOPIC_SYS: string = '$SYS/';
  private sourceMap: Map<string,{name:string,price:number}> = new Map<string,{name:string,price:number}>();

  constructor(@inject(TYPES.LoggerService) loggerService: LoggerService,
              @inject(TYPES.SocketService) socketService: SocketService,
              @inject(TYPES.NodeService) nodeService: NodeService) {
    this.LOGGER = loggerService;
    this.socketService = socketService;
    this.nodeService = nodeService;
  }

  public handleMessage(timestamp: Moment, client: MqttClient, packet: MqttPacket) {
    if (!packet.topic.startsWith(this.TOPIC_SYS)) {

      this.socketService.broadcast(packet.topic, packet.messageId);
      // // sails.log.debug(JSON.stringify(NodeService.nodeSourceMap));
      // Check to see if this message has come across the hub topic
      this.nodeService.addNode(client.id, 'test', 'test');
      if (packet.topic === this.TOPIC_HUB) {
      //   this.handleMessageForHub(timestamp, client, packet);
      // } else if(NodeService.nodeSourceMap[packet.topic]) {
      } else {
        // Otherwise assume this message is for a device
        // this.handleMessageForNode(packet.topic, timestamp, client, packet);
      // } else {
        this.LOGGER.debug("[" + timestamp.format() + "]  Packet:" + JSON.stringify(packet));
      }
    }
  }

   /**
   * Handle messages directed at the hub
   */
  private handleMessageForHub(timestamp: Moment, client: MqttClient, packet: MqttPacket): void {

    this.saveMessage(timestamp, client.id, packet.topic, packet.payload);

    // // Check for the existence of this node
    // NodeService.getNode(client.id,
    //   function (node) {
    //     if (!node) {
    //       // New node so save it
    //       NodeService.addNode(client.id, null, 'mqtt');
    //     } else {
    //       sails.log('Message from nodeId: ' + client.id + ' ' + packet.payload);
    //     }
    //   }
    // );
  }

  private handleMessageForNode(nodeId: string, timestamp: Moment, client: MqttClient, packet: MqttPacket): void {
//     // sails.log.debug('Device message for nodeId: ' + nodeId + ' ' + packet.payload);
//
//     // Lookup the bridge for this source and pass it along
//     var source = NodeService.nodeSourceMap[nodeId];
//
//     if (source) {
//       var callbackBridge = MessageService.sourceMap[source];
//
//       if (callbackBridge && callbackBridge.handleMessage) {
//         callbackBridge.handleMessage(nodeId, packet.payload);
//       } else {
//         sails.log.error('No callback for source:' + source);
//       }
//     } else {
//       sails.log.error('No source for nodeId:' + nodeId);
//     }
  }

  /**
   * Register a node source with its handler method
   *
   * @param key
   * @param handler
   */
  private registerSource(key: any, handler: any): void {
//     this.sourceMap[key] = handler;

  }

  /**
   * Save a message to the log
   *
   * @param timestamp
   * @param clientId
   * @param topic
   * @param payload
   */
  private saveMessage(timestamp: Moment, clientId: string, topic: string, payload: Object): void {
    // Message.create(
//       {
//         topic: topic,
//         nodeId: clientId,
//         message: payload,
//         createdAt: timestamp.toDate()
//       }).exec(
//       function callback(error, created) {
//         if (error) {
//           sails.log.error(error);
//         } else {
//           sails.sockets.broadcast('message', 'message_created', created);
//
//           sails.log.debug("[" + timestamp.format() + "] message saved");
//         }
//       }
//     );
  }

}
//
//   /**
//    * Query the message log
//    *
//    * @param limit
//    * @param offset
//    * @returns {*}
//    */
//   query: function (limit, offset, cb) {
//     Message.find({skip: offset, limit: limit}).sort({createdAt:-1}).exec(
//       function(err, results) {
//         if (!err) {
//           return cb(results);
//         }
//       }
//     );
//   },
//
//   /**
//    * Clear out the message log
//    */
//   clear: function() {
//     Message.drop();
//   }
// };
