import {inject, injectable} from 'inversify';
import TYPES from '../constants/identifiers';
import {LoggerService} from './logger.service';
import {Moment} from 'moment';
import * as moment from 'moment';
import * as async from 'async';
import * as mongoose from 'mongoose';
import {INode, NodeSchema, Node} from '../models/node';
import * as Promise from 'bluebird';
import {Capability, ICapability, CapabilitySchema} from '../models/capability';


@injectable()
export class NodeService {
  private LOGGER: LoggerService;
  private nodeMap: Map<String, Node> = new Map<String, Node>();

  constructor(@inject(TYPES.LoggerService) loggerService: LoggerService) {
    this.LOGGER = loggerService;

    this.loadSourceMap();
  }

  /**
   * Attempt to add a new node if it is a node ID that hasn't been seen before
   * @param nodeId
   * @param name
   * @param source
   */
  public addNode(nodeId: string, name: string, source: string): Promise<Node> {

    let promise = new Promise<Node>((resolve, reject) => {

      this.getNode(nodeId).then((node: Node) => {

        // if we have the node already then return it
        if (node) {
          resolve(node);
        } else {
          this.saveNode(nodeId, name, source).then(
            (node: Node) => {
              resolve(node);
            });
        }
      });
    });

    return promise;
  }

  /**
   * Get a node based on its ID
   *
   * @param nodeId
   * @returns {Bluebird}
   */
  public getNode(nodeId: string): Promise<Node> {

    let promise = new Promise<Node>(
      (resolve, reject) => {

        NodeSchema.findOne({id: nodeId}).populate('capabilities').exec(
          (err: any, res: INode) => {
            if (err) {
              reject(err);
            }
            else {
              if (res) {
                resolve(new Node(res));
              }
              else {
                resolve(null);
              }
            }
          });
      }
    );

    return promise;
  }

//
//   query: function (limit, offset, cb) {
//     var ns = this;
//
//     Node.find({skip: offset, limit: limit}).sort({createdAt: -1}).populate('capabilities').exec(
//       function (err, results) {
//         if (!err) {
//
//           // Flatten the capability objects
//           var nodes = [];
//           _.each(results, function (node) {
//             nodes.push(ns.flattenCapabilities(node));
//           });
//
//           return cb(nodes);
//         }
//       }
//     );
//   },
//
//   flattenCapabilities: function(node) {
//     if (node) {
//       var capabilities = _.pluck(node.capabilities, 'capability');
//       return {
//         id: node.id,
//         name: node.name,
//         source: node.source,
//         createdAt: node.createdAt,
//         capabilities: capabilities
//       };
//     } else {
//       return null;
//     }
//   },
//
//   clear: function () {
//     Node.drop();
//   },
//

  /**
   * Load nodes from storage into the source map
   *
   * @returns {Bluebird<void>}
   */
  private loadSourceMap(): Promise<void> {
    let promise = new Promise<void>(
      (resolve, reject) => {

        NodeSchema.find().populate('capabilities').exec(
          (err: any, nodes: INode[]) => {
            if (err) {
              this.LOGGER.error('NodeService - Error loading source map: ' + err);
              reject(err);
            } else {
              async.each(nodes, (node: INode) => {
                this.LOGGER.info('NodeService: loading nodeId: ' + node.id);
                //             // Only map external sources
//             if (node.source != 'mqtt') {
//               that.nodeSourceMap[node.id] = node.source;
//             }

                this.nodeMap.set(node.id,new Node(node));
              }, () => {
                resolve();
              });
            }
          }
        );
      }
    );

    return promise;
  }

//
//   /**
//    * Add a node capabilities
//    */
//   addNodeCapabilities: function (nodeId, capabilities) {
//     var that = this;
//
//     _.each(capabilities, function (capability) {
//       that.addNodeCapability(nodeId, capability);
//     });
//   },
//
//   /**
//    * Add a node capability
//    */
//   addNodeCapability: function (nodeId, capability) {
//     var that = this;
//
//     Capability.count(
//       {
//         node: nodeId,
//         capability: capability
//       }).exec(
//       function callback(error, numFound) {
//         if (error) {
//           sails.log.error(error);
//         } else if (numFound == 0) {
//           that._saveNodeCapability(nodeId, capability);
//         }
//       }
//     );
//   },

  /**
   * Save a new node to storage
   *
   * @param nodeId
   * @param name
   * @param source
   */
  private saveNode(nodeId: string, name: string, source: string): Promise<Node> {

    let promise = new Promise<Node>((resolve, reject) => {

      // If we don't have the node then save it
      let nodeData = <INode>{
        id: nodeId,
        name: name,
        source: source
      };

      NodeSchema.create(nodeData, (err: any, res: INode) => {
        if (err) {
          reject(err);
        } else {
          let node = new Node(res);

          this.nodeMap.set(nodeId, node);
//           sails.sockets.broadcast('node', 'node_created', created);
          this.LOGGER.debug("NodeService - node " + nodeId + " saved");
          resolve(node);
        }
      });
    });

    return promise;
  }

  /**
   * Save the capability for a node
   *
   * @param node
   * @param capability
   * @returns {Bluebird<Capability>}
   */
  private saveCapability(node: INode, capability: string): Promise<Capability> {

    let promise = new Promise<Capability>((resolve, reject) => {

      let capabilityData = <ICapability>{
        node: node,
        capability: capability
      };

      CapabilitySchema.create(capabilityData, (err: any, res: ICapability) => {
        if (err) {
          reject(err);
        } else {
          let capability = new Capability(res);

//           sails.sockets.broadcast('node', 'node_created', created);
          this.LOGGER.debug("NodeService - capability " + node.id + " - " + capability + " saved");
          resolve(capability);
        }
      });
    });

    return promise;
  }
}
