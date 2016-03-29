import {Injectable, bind} from 'angular2/core';
import {Node} from '../models/node';
import {Observable} from 'rxjs/Observable';
import 'rxjs/rx';
declare var io:any;

@Injectable()
export class NodeService {

    public nodes$:Observable<Array<Node>>;
    private nodeObserver:any;
    private dataStore:{
        nodes:Array<Node>,
        nodeMap:{ [key:string]:Node }
    };

    constructor() {

        var thisNs:NodeService = this;

        this.dataStore = {nodes: [], nodeMap: {}};

        this.nodes$ = new Observable(
            function (observer) {
                thisNs.nodeObserver = observer;

                thisNs.initialize();
            }
        ).share().publishReplay(1000).refCount();
    }

   public initialize(): void {
        var thisNs:NodeService = this;

        io.socket.on('node_created', function gotHelloMessage(nodeJson) {
            thisNs.addNode(
                thisNs.nodeFromJson(nodeJson));
        });

        io.socket.get('/api/nodes', function gotHelloMessage(data) {
            if (data) {
                _.each(data, function (nodeJson:Node) {
                    thisNs.addNode(
                        thisNs.nodeFromJson(nodeJson));
                });
            }
        });
    }

    public nodeFromJson(nodeJson:Node):Node {
        var node:Node = new Node(nodeJson.createdAt, nodeJson.id, nodeJson.name, nodeJson.source, nodeJson.capabilities);

        return node;
    }

    // an imperative function call to this action stream
    public addNode(node:Node):void {
        this.dataStore.nodes.unshift(node);
        this.dataStore.nodeMap[node.id] = node;
        this.nodeObserver.next(this.dataStore.nodes);
    }

    public getNode(nodeId:string):Promise<Node> {
        var thisNs = this;
        return new Promise(function (resolve, reject) {
            io.socket.get('/api/nodes/' + nodeId, function gotNode(data) {
                if (data) {
                    resolve(thisNs.nodeFromJson(data));
                } else {
                    reject();
                }
            });
        });
    }
}

export var nodeServiceInjectables:Array<any> = [
    bind(NodeService).toClass(NodeService)
];
