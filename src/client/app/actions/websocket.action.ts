import {Action} from '@ngrx/store';
import {type} from '../utils/type';

export const ActionTypes = {
    CONNECTED_STATE: type('[Websocket] Connected State'),
    INITIALIZING_STATE: type('[Websocket] Initializing State'),
    DISCONNECTED_STATE: type('[Websocket] Disconnected State')
};


export class WebsocketInitializingAction implements Action {
    type = ActionTypes.INITIALIZING_STATE;
}

export class WebsocketDisconnectedAction implements Action {
    type = ActionTypes.DISCONNECTED_STATE;
}

export class WebsocketConnectedAction implements Action {
    type = ActionTypes.CONNECTED_STATE;
}


export type Actions
    = WebsocketConnectedAction
    | WebsocketDisconnectedAction
    | WebsocketInitializingAction;

