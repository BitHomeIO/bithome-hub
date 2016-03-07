import {messageServiceInjectables} from './MessageService';
import {nodeServiceInjectables} from './NodeService';
import {bridgeServiceInjectables} from './BridgeService';

export * from './MessageService';
export * from './NodeService';
export * from './BridgeService';

export var serviceInjectables: Array<any> = [
    messageServiceInjectables,
    nodeServiceInjectables,
    bridgeServiceInjectables
];
