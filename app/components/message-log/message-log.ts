import {Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef} from 'angular2/core';
import {Message} from '../../models/message';
import {MessageService} from '../../services/MessageService';
import {MessageLogEntry} from '../message-log-entry/message-log-entry';
import {Observable} from 'rxjs/Observable';
import {OnDestroy} from 'angular2/core';
import {Subscription} from 'rxjs/Subscription';
import {Subscriber} from 'rxjs/Subscriber';

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
export class MessageLog implements OnInit, OnDestroy {
    private messagesSubscription: Subscription;
    private messages: Observable<Array<Message>>;
    private messagesObserver: Subscriber<Array<Message>>;
    private messagesStore: {
        messages: Array<Message>
    };

    constructor(public messageService: MessageService, private ref: ChangeDetectorRef) {

    }

    public ngOnInit(): void {
        console.log('onInit');

        this.messages = new Observable(observer =>
            this.messagesObserver = observer);

        this.messagesStore = { messages: [] };

        this.messagesSubscription = this.messageService.messages.subscribe(
            (messages) => {
                this.messagesStore.messages = messages;
                this.messagesObserver.next(this.messagesStore.messages);
                this.ref.detectChanges();
            }
        );
    }

    public ngOnDestroy(): void {
        console.log('onDestroy');
        if (this.messagesSubscription) {
            this.messagesSubscription.unsubscribe();
            console.log('unsubscribe: ' + this.messagesSubscription.isUnsubscribed);
        }
        if (this.messagesObserver) {
            this.messagesObserver.unsubscribe();
        }
    }
}

