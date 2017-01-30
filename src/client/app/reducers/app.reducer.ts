import {Actions, ActionTypes} from '../actions/app.action';


export interface State {
    showDisconnectInterrupt: boolean;
}

const initialState: State = {
    showDisconnectInterrupt: false,
};

export function reducer(state = initialState, action: Actions): State {
    switch (action.type) {
        case ActionTypes.READY_STATE:
            return {
                showDisconnectInterrupt: false
            };

        case ActionTypes.DISCONNECTED_STATE:
            return {
                showDisconnectInterrupt: true
            };

        case ActionTypes.LOGGED_OUT_STATE:
            return {
                showDisconnectInterrupt: false
            };

        default:
            return state;
    }
}

export const getShowDisconnectInterrupt = (state: State) => state.showDisconnectInterrupt;

