import {injectable} from 'inversify';
import * as winston from 'winston';

@injectable()
export class LoggerService {

  constructor() {

    winston.setLevels({
      trace: 0,
      input: 1,
      verbose: 2,
      prompt: 3,
      debug: 4,
      info: 5,
      data: 6,
      help: 7,
      warn: 8,
      error: 9
    });

    winston.addColors({
      trace: 'magenta',
      input: 'grey',
      verbose: 'cyan',
      prompt: 'grey',
      debug: 'blue',
      info: 'green',
      data: 'grey',
      help: 'cyan',
      warn: 'yellow',
      error: 'red'
    });

    winston.remove(winston.transports.Console)
    winston.add(winston.transports.Console, {
      prettyPrint: true,
      colorize: true,
      silent: false,
      timestamp: true
    });
  }

  public info(msg: string): void {
    winston.info(msg);
  }

  public debug(msg: string): void {
    winston.debug(msg);
  }

  public warn(msg: string): void {
    winston.warn(msg);
  }

  public error(msg: string): void {
    winston.error(msg);
  }

}
