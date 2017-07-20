import {autoserializeAs, autoserialize} from 'cerialize';
export class MqttPacketPayload {
  @autoserialize public type: string;
  @autoserializeAs(Buffer) public data: Buffer;
}

export class MqttPacket {
  @autoserialize public topic: string;
  @autoserialize public messageId: string;
  @autoserializeAs(Buffer) public payload: Buffer;
}
