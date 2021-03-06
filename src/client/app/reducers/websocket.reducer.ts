import {Actions, ActionTypes} from '../actions/websocket.action';


export interface WebsocketState {
    showWebsocketDisconnectInterrupt: boolean;
    reconnectWebsocket: boolean;
}

const initialState: WebsocketState = {
    showWebsocketDisconnectInterrupt: false,
    reconnectWebsocket: false
};

export function reducer(state = initialState, action: Actions): WebsocketState {
    switch (action.type) {
        case ActionTypes.CONNECTED_STATE:
            return {
                showWebsocketDisconnectInterrupt: false,
                reconnectWebsocket: false
            };

        case ActionTypes.DISCONNECTED_STATE:
            return {
                showWebsocketDisconnectInterrupt: true,
                reconnectWebsocket: true
            };

        case ActionTypes.INITIALIZING_STATE:
            return {
                showWebsocketDisconnectInterrupt: false,
                reconnectWebsocket: false
            };

        default:
            return state;
    }
}

export const getShowWebsocketDisconnectInterrupt = (state: WebsocketState) => state.showWebsocketDisconnectInterrupt;
export const getReconnectWebsocket = (state: WebsocketState) => state.reconnectWebsocket;

