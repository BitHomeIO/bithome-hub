import {Injectable, bind} from 'angular2/core';
import 'rxjs/rx';
import {Observable} from 'rxjs/Observable';
declare var io: any;

@Injectable()
export class ActionService {

    private observables: { [key:string]:{ [key:string]:Observable<string[]>; }; };
    private observers: { [key:string]:{ [key:string]:any; }; };

    constructor() {

        this.observables = {};
        this.observers = {};

        io.socket.on('value_updated', (messageJson: any) => {
            var nodeId: string = messageJson.nodeId;
            var capability: string = messageJson.capability;

            if (nodeId && capability) {
                if (this.observers[nodeId] && this.observers[nodeId][capability]) {
                    this.observers[nodeId][capability].next(messageJson.params);
                }
            }
        });
    }


    public executeCapability(nodeId: string, capability: string, parameters: string[]): void {
        io.socket.post('/api/nodes/' + nodeId + '/capabilities/' + capability,
            { params: parameters },
            function response(data) {
            if (data) {
                console.log(JSON.stringify(data));
            }
        });
    }

    public getValueUpdatesForCapability(nodeId: string, capability: string): Observable<string[]> {
        if (!this.observables[nodeId]) {
            this.observables[nodeId] = {};
            this.observers[nodeId] = {};

            io.socket.get('/api/nodes/' + nodeId + '/values',
                function response(data) {
                    if (data) {
                        console.log(JSON.stringify(data));
                    }
                }
            );
        }

        if (!this.observables[nodeId][capability]) {
            this.observables[nodeId][capability] = new Observable<string[]>(observer =>
                this.observers[nodeId][capability] = observer).share().publishReplay(1).refCount();
        }

        return this.observables[nodeId][capability];
    }

    public stopValueUpdates(nodeId: string): void {
        io.socket.delete('/api/nodes/' + nodeId + '/values');
    }
}

export var actionServiceInjectables: Array<any> = [
    bind(ActionService).toClass(ActionService)
];
