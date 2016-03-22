import {Injectable, bind} from 'angular2/core';
import {Node} from '../models/node';
import {Subject} from 'rxjs/Subject';
import {Observable} from 'rxjs/Observable';
import {Operator} from 'rxjs/Operator';
import 'rxjs/rx';
declare var io: any;

@Injectable()
export class NodeService {

    public nodes$: Observable<Array<Node>>;
    private nodeObserver: any;
    private dataStore: {
        nodes: Array<Node>
    };

    constructor() {

        this.nodes$ = new Observable(observer =>
            this.nodeObserver = observer).share().publishReplay(1000).refCount();

        this.dataStore = { nodes: [] };

        var thisNs: NodeService = this;

        io.socket.on('node_created', function gotHelloMessage(nodeJson) {
            thisNs.addNode(
                thisNs.nodeFromJson(nodeJson));
        });

        io.socket.get('/api/nodes', function gotHelloMessage(data) {
            if (data) {
                _.each(data, function (nodeJson: Node) {
                    thisNs.addNode(
                        thisNs.nodeFromJson(nodeJson));
                });
            }
        });
    }

    public nodeFromJson(nodeJson: Node): Node {
        var node: Node = new Node(nodeJson.createdAt, nodeJson.id, nodeJson.name, nodeJson.source, nodeJson.capabilities);

        return node;
    }

    // an imperative function call to this action stream
    public addNode(node: Node): void {
        this.dataStore.nodes.unshift(node);
        this.nodeObserver.next(this.dataStore.nodes);
    }
}

export var nodeServiceInjectables: Array<any> = [
    bind(NodeService).toClass(NodeService)
];
