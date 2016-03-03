import {Component} from 'angular2/core';
import {MessageList} from '../message-list/message-list';

@Component({
    selector: 'messages',
    directives: [MessageList],
    templateUrl: 'app/components/messages/messages.html',
    styleUrls: ['app/components/messages/messages.css']
})
export class Messages {

}

