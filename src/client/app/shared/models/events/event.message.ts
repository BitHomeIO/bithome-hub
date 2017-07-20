import {deserialize, SerializableEnumeration, autoserializeAs} from 'cerialize';
export enum EventMessageType {
    RAW_PAYLOAD,
    HEARTBEAT_EVENT
}
SerializableEnumeration(EventMessageType);

export class EventMessage {
    @autoserializeAs(EventMessageType) public eventType: EventMessageType;
    @deserialize public payload: string;
}

