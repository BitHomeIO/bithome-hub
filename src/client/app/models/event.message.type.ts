import {deserialize, SerializableEnumeration, autoserializeAs} from 'cerialize';
export enum EventMessageType {
    HEARTBEAT_EVENT,
    HARDWARE_STATUS_EVENT,
    HARDWARE_DEBUG_EVENT,
    HARDWARE_SURVEY_EVENT
}
SerializableEnumeration(EventMessageType);


export class EventMessage {
    @autoserializeAs(EventMessageType) public eventType: EventMessageType;
    @deserialize public eventData: string;
}

