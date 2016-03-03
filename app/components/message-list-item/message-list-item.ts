import {Component} from 'angular2/core';
import {Message} from '../../models/message';

@Component({
    inputs: ['message'],
    selector: 'message-list-item',
    templateUrl: 'app/components/message-list-item/message-list-item.html',
    styleUrls: ['app/components/message-list-item/message-list-item.css']
})
export class MessageListItem {
    private message: Message;
}

