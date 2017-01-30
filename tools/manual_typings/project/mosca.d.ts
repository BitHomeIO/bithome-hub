declare module "mosca" {
  interface ServerOpts {
    allowNonSecure?: boolean,
    port?: number,
    logger?: {
      level: string
    },
    https?: {
      port?: number,
    },
    http?: {
      port?: number,
      bundle?: boolean,
      static?: string
    },
    secure?: {
      port: number;
      keyPath: string;
      certPath: string;
    }
  }

  export class Server extends NodeJS.EventEmitter {
    constructor(opts: ServerOpts);
    public toString: () => string;
    public subscribe: (topic: any, callback: any, done: any) => any;
    public publish: (packet: any, client: any, callback: any) => any;
    public authenticate: (client: any, username: any, password: any, callback: any) => any;
    public authorizePublish: any;
    public authorizeSubscribe: any;
  }
}
