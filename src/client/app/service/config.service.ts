export class ConfigService {

    public static getApiPath(): string {
        return 'localhost:3000/api';
    }

    public static getWebsocketPath(): string {
      return 'localhost:3000/ws';
    }
}
