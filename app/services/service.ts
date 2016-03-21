import {messageServiceInjectables} from './MessageService';
import {nodeServiceInjectables} from './NodeService';
import {bridgeServiceInjectables} from './BridgeService';
import {actionServiceInjectables} from './ActionService';

export * from './MessageService';
export * from './NodeService';
export * from './BridgeService';
export * from './ActionService';

export var serviceInjectables: Array<any> = [
    messageServiceInjectables,
    nodeServiceInjectables,
    bridgeServiceInjectables,
    actionServiceInjectables
];
