import {Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef} from 'angular2/core';
import {Message} from '../../models/message';
import {MessageService} from '../../services/MessageService';
import {MessageListItem} from '../message-list-item/message-list-item';
import {Observable} from 'rxjs/Observable';
import {OnDestroy} from 'angular2/core';
import {Subscription} from 'rxjs/Subscription';

@Component({
    selector: 'message-list',
    directives: [MessageListItem],
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: 'app/components/message-list/message-list.html',
    styleUrls: ['app/components/message-list/message-list.css']
})
export class MessageList implements OnInit, OnDestroy {
    private messagesSubscription: Subscription;
    private messages: Observable<Array<Message>>;

    constructor(public messageService: MessageService, private ref: ChangeDetectorRef) {

    }

    public ngOnInit(): void {

        this.messages = this.messageService.messages$;

        this.messagesSubscription = this.messageService.messages$.subscribe(
            (messages) => {
                this.ref.detectChanges();
            }
        );
    }

    public ngOnDestroy(): void {
        if (this.messagesSubscription) {
            this.messagesSubscription.unsubscribe();
        }
    }
}

