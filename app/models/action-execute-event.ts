import {Action} from './action';
export class ActionExecuteEvent {
    public action: Action;
    public params: string[];

    constructor(action: Action, params: string[]) {
        this.action = action;
        this.params = params;
    }
}

