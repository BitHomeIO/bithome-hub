import {Component, OnInit, ChangeDetectionStrategy} from 'angular2/core';
import {Message} from '../../models/message';
import {MessageService} from '../../services/MessageService';
import {MessageLogEntry} from '../message-log-entry/message-log-entry';
import {Observable} from 'rxjs/Observable';

@Component({
    selector: 'message-log',
    directives: [MessageLogEntry],
    changeDetection: ChangeDetectionStrategy.OnPushObserve,
    template: `
        <h1>Message Log</h1>
        <div>
            <message-log-entry *ngFor="#message of messages | async" [message]="message"></message-log-entry>
        </div>

    `,
})
export class MessageLog {
    private messages: Observable<any>;

    constructor(public messageService: MessageService) {
    }

    private ngOnInit(): void {
        this.messages = this.messageService.messages;
    }
}

