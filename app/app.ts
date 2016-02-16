import {Component} from 'angular2/core';
import {MessageLog} from './components/message-log/message-log';
import {MessageService} from './services/MessageService';
import {AppExampleData} from './appExampleData';
@Component({
    directives: [MessageLog],
    selector: 'my-app',
    template: '<message-log></message-log>',
})
export class App {
    constructor(public messageService: MessageService) {
        AppExampleData.init(messageService);
    }
}
