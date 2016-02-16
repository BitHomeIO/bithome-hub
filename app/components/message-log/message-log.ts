import {Component} from 'angular2/core';

@Component({
    selector: 'message-log',
    template: `
        <h1>Message Log</h1>
        <ul>
            <li *ngFor="#message of getMessages()">{{message.getMessage()}}</li>
        </ul>

    `,
})
export class MessageLog {
    private messages: Message[];

    public getMessages(): Message[] {
        return this.messages;
    }
}
