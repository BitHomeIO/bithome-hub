import {Injectable, bind} from 'angular2/core';
import {Message} from '../models/message';
import {Subject} from 'rxjs/Subject';
import {Observable} from 'rxjs/Observable';
import {Operator} from 'rxjs/Operator';
declare var io: any;
import 'rxjs/rx';

@Injectable()
export class ActionService {

    public executeCapability(nodeId: string, capability: string, parameters: string[]): void {
        io.socket.post('/api/nodes/' + nodeId + '/capabilities/' + capability,
            { params: parameters },
            function response(data) {
            if (data) {
                console.log(JSON.stringify(data));
            }
        });
    }
}

export var actionServiceInjectables: Array<any> = [
    bind(ActionService).toClass(ActionService)
];
