import {Component} from 'angular2/core';
import {MessageLog} from './components/message-log/message-log';
@Component({
    directives: [MessageLog],
    selector: 'my-app',
    template: '<message-log></message-log>',
})
export class AppComponent {

}
