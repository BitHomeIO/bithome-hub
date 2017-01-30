import {Action} from '@ngrx/store';
import {type} from '../utils/type';

export const ActionTypes = {
    READY_STATE: type('[App] Ready State'),
    LOGGED_OUT_STATE: type('[App] Logged Out State'),
    DISCONNECTED_STATE: type('[App] Disconnected State')
};


export class AppReadyAction implements Action {
    type = ActionTypes.READY_STATE;
}

export class AppDisconnectedState implements Action {
    type = ActionTypes.DISCONNECTED_STATE;
}

export class AppLoggedOutState implements Action {
    type = ActionTypes.LOGGED_OUT_STATE;
}


export type Actions
    = AppReadyAction
    | AppDisconnectedState
    | AppLoggedOutState;

