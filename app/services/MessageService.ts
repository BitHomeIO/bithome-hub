import {Injectable, bind} from 'angular2/core';
import {Message} from '../models/message';
import {Subject} from 'rxjs/Subject';
import {Observable} from 'rxjs/Observable';
import {Operator} from 'rxjs/Operator';
import 'rxjs/rx';

interface IMessagesOperation extends Function {
    (messages: Message[]): Message[];
}

@Injectable()
export class MessageService {

    public messages$: Observable<Array<Message>>;
    private messageObserver: any;
    private dataStore: {
        messages: Array<Message>
    };

    constructor() {

        // Create Observable Stream to output our data
        this.messages$ = new Observable(observer =>
            this.messageObserver = observer).share().publishReplay(1000).refCount();

        this.dataStore = { messages: [] };

        var thisMessageService: MessageService = this;

        io.socket.on('message_created', function gotHelloMessage(messageJson) {
            thisMessageService.addMessage(
                thisMessageService.messageFromJson(messageJson),
                true);
        });

        io.socket.get('/api/messages', function gotHelloMessage(data) {
            if (data) {
                _.each(data, function (messageJson: Message) {
                    thisMessageService.addMessage(
                        thisMessageService.messageFromJson(messageJson),
                        false);
                });
            }
        });
    }

    public messageFromJson(messageJson: Message): Message {
        var message: Message = new Message(
            messageJson.createdAt,
            messageJson.nodeId,
            messageJson.topic,
            messageJson.message);

        return message;
    }

    // an imperative function call to this action stream
    public addMessage(message: Message, isFirst: boolean): void {
        if (isFirst) {
            this.dataStore.messages.unshift(message);
        } else {
            this.dataStore.messages.push(message);
        }
        this.messageObserver.next(this.dataStore.messages);
    }
}

export var messageServiceInjectables: Array<any> = [
    bind(MessageService).toClass(MessageService)
];
