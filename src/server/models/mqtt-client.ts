export class MqttClient {
  public id: string;

  public toString = () : string => {
    if (this.id) {
      return this.id;
    } else {
      return 'undefined';
    }
  }
}
