import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {Deserialize, Serialize} from 'cerialize';
import {Response, Headers, RequestOptions, ResponseContentType} from '@angular/http';
import {WebSocketService} from './websocket.service';
import {EventMessage, EventMessageType} from '../shared/models/events/event.message';

@Injectable()
export class MessageService {

    constructor(private webSocketService: WebSocketService) {
        // noop
    }

    public getMessageStream(): Observable<EventMessage> {
        return this.webSocketService.getStream('messages', EventMessageType.RAW_PAYLOAD).map(
            (message: any) => {
                return message;
                // var eventMessage: EventMessage = Deserialize(message, EventMessage);
                // return eventMessage;
            }
        );
    }
}
