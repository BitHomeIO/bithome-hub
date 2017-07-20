import {deserialize, autoserializeAs, autoserialize} from 'cerialize';
import {EventMessageType} from './event.message.type';

export class EventMessage {
    @autoserializeAs(EventMessageType) public eventType: EventMessageType;
    @autoserializeAs(String) public payload: string;


    constructor(eventType: EventMessageType, payload: string) {
        this.eventType = eventType;
        this.payload = payload;
    }
}

