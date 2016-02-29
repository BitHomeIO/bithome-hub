import {Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef} from 'angular2/core';
import {Message} from '../../models/message';
import {MessageService} from '../../services/MessageService';
import {MessageLogEntry} from '../message-log-entry/message-log-entry';
import {Observable} from 'rxjs/Observable';

@Component({
    selector: 'message-log',
    directives: [MessageLogEntry],
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `
        <h1>Message Log: {{ test }}</h1>
        <div>
            <message-log-entry *ngFor="#message of messages | async" [message]="message"></message-log-entry>
        </div>

    `,
})
export class MessageLog implements OnInit {
    private messages: Observable<Array<Message>>;
    private messagesObserver: any;
    private messagesStore: {
        messages: Array<Message>
    };

    constructor(public messageService: MessageService, private ref: ChangeDetectorRef) {
        this.messages = new Observable(observer =>
            this.messagesObserver = observer).share();

        this.messagesStore = { messages: [] };
    }

    public ngOnInit(): void {
        //this.messages = this.messageService.messages;

        this.messageService.messages.subscribe(
            (messages) => {
                this.messagesStore.messages = messages;
                this.messagesObserver.next(this.messagesStore.messages);
                this.ref.detectChanges();
            }
        );
    }
}

