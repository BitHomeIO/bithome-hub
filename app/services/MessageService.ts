import {Injectable, bind} from 'angular2/core';
import {Message} from '../models/message';
import {Subject} from 'rxjs/Subject';
import {Observable} from 'rxjs/Observable';
import {Operator} from 'rxjs/Operator';
import 'rxjs/rx';

let initialMessages: Message[] = [];

interface IMessagesOperation extends Function {
    (messages: Message[]): Message[];
}

@Injectable()
export class MessageService {
    // a stream that publishes new messages only once
    public newMessages: Subject<Message> = new Subject<Message>();

    // `messages` is a stream that emits an array of the most up to date messages
    public messages: Observable<Message[]>;

    // `updates` receives _operations_ to be applied to our `messages`
    // it's a way we can perform changes on *all* messages (that are currently
    // stored in `messages`)
    public updates: Subject<any> = new Subject<any>();

    // action streams
    public create: Subject<Message> = new Subject<Message>();

    constructor() {
        this.messages = this.updates
            // watch the updates and accumulate operations on the messages
            .scan((messages: Message[],
                   operation: IMessagesOperation) => {
                    return operation(messages);
                },
                initialMessages)
            // make sure we can share the most recent list of messages across anyone
            // who's interested in subscribing and cache the last known list of
            // messages
            .publishReplay(1)
            .refCount();

        // `create` takes a Message and then puts an operation (the inner function)
        // on the `updates` stream to add the Message to the list of messages.
        //
        // That is, for each item that gets added to `create` (by using `next`)
        // this stream emits a concat operation function.
        //
        // Next we subscribe `this.updates` to listen to this stream, which means
        // that it will receive each operation that is created
        //
        // Note that it would be perfectly acceptable to simply modify the
        // "addMessage" function below to simply add the inner operation function to
        // the update stream directly and get rid of this extra action stream
        // entirely. The pros are that it is potentially clearer. The cons are that
        // the stream is no longer composable.
        this.create
            .map( function(message: Message): IMessagesOperation {
                return (messages: Message[]) => {
                    console.log(`Adding message: ${message.getMessage()}`);
                    return messages.concat(message);
                };
            })
            .subscribe(this.updates);

        this.newMessages
            .subscribe(this.create);
    }

    // an imperative function call to this action stream
    public addMessage(message: Message): void {
        this.newMessages.next(message);
    }
}

export var messageServiceInjectables: Array<any> = [
    bind(MessageService).toClass(MessageService)
];
