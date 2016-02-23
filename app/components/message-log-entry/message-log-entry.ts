import {Component} from 'angular2/core';
import {Message} from '../../models/message';

@Component({
    inputs: ['message'],
    selector: 'message-log-entry',
    template: `
        <div>
            [{{message.getTimestamp()}}] {{message.getNode()}} - {{message.getMessage()}}
        </div>

    `,
})
export class MessageLogEntry {
    private message: Message;
}

