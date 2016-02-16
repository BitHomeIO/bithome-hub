/* tslint:disable:max-line-length */
import {Message} from './models/message';
import {MessageService} from './services/messageService';

let initialMessages: Array<Message> = [
    new Message(
        new Date(),
        'test-node',
        'test-channel',
        'this is test message 1'
    ),
    new Message(
        new Date(),
        'test-node',
        'test-channel',
        'this is test message 1'
    ),
];

export class AppExampleData {
    public static init(messageService: MessageService): void {

        // TODO make `messages` hot
        messageService.messages.subscribe(() => ({}));

        // create the initial messages
        initialMessages.map( (message: Message) => messageService.addMessage(message) );
    }
}
