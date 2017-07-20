import {SerializableEnumeration} from 'cerialize';
export enum EventMessageType {
    RAW_PAYLOAD,
    HEARTBEAT_EVENT,
    HARDWARE_STATUS_EVENT,
    HARDWARE_DEBUG_EVENT,
    HARDWARE_SURVEY_EVENT
}
SerializableEnumeration(EventMessageType);

