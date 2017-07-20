declare module "socketio-wildcard" {
    export class SocketIOWildcard {
        constructor(emitter: SocketIOClient.ManagerStatic);
        public patch: (socket: SocketIOClient.Socket) => any;
    }
}
