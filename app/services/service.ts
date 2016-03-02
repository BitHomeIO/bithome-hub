import {messageServiceInjectables} from './MessageService';
import {nodeServiceInjectables} from './NodeService';

export * from './MessageService';
export * from './NodeService';

export var serviceInjectables: Array<any> = [
    messageServiceInjectables,
    nodeServiceInjectables
];
