import {existsSync, lstatSync, readFileSync, readdirSync} from 'fs';
import * as express from 'express';
import * as fallback from 'express-history-api-fallback';
import * as openResource from 'open';
import * as tildify from 'tildify';
import * as isstream from 'isstream';
import {resolve, join} from 'path';

import * as codeChangeTool from '../seed/code_change_tools';
import * as util from 'gulp-util';
import Config from '../../config';

abstract class BitHomeServer {
  abstract run(done?: any): any | Promise<any> | void;
}

/**
 * Serves the Single Page Application. More specifically, calls the `listen` method, which itself launches BrowserSync.
 */
export function bithomeServeSPA() {
  util.log('Loading BitHome Server');
  // codeChangeTool.listen();

  // var server: BitHomeServer = new BitHomeServer();

  let cwd = join(process.cwd(), Config.SERVER_DEST);
  // readDir(cwd,
  //   taskname => {
  //     util.log('Found BitHome Server', util.colors.yellow(tildify(taskname)));
  //     registerServer(taskname, cwd);
  //   }
  // );

  let serverContainer: any = require(join(cwd, 'bithome.server')) ;

  var bithomeServer: BitHomeServer = new serverContainer.BitHomeServer();

  bithomeServer.run();

}


function readDir(root: string, cb: (taskname: string) => void) {
  if (!existsSync(root)) {
    return;
  }

  walk(root);

  function walk(path: string) {
    let files = readdirSync(path);
    for (let i = 0; i < files.length; i += 1) {
      let file = files[i];
      let curPath = join(path, file);
      if (lstatSync(curPath).isFile() && /bithome\.server\.js$/.test(file)) {
        let taskname = file.replace(/\.js$/, '');
        cb(taskname);
      }
    }
  }
}


function normalizeServer(task: any, taskName: string) {
  util.log('Normalizing server ' + task);
  if (task instanceof BitHomeServer) {
    util.log('Running correct server');
    return task;
  }
  if (task.prototype && task.prototype instanceof BitHomeServer) {
    util.log('Running prototype server');
    return new task();
  }
  if (typeof task === 'function') {
    return new class AnonTask extends BitHomeServer {
      run(done: any) {
        util.log('Running anon server');
        if (task.length > 0) {
          return task(done);
        }

        const taskReturnedValue = task();
        if (isstream(taskReturnedValue)) {
          return taskReturnedValue;
        }

        done();
      }
    };
  }
  throw new Error(taskName + ' should be instance of the class ' +
    'Task, a function or a class which extends Task.');
}

/**
 * Registers the task by the given taskname and path.
 * @param {string} taskname - The name of the task.
 * @param {string} path     - The path of the task.
 */
function registerServer(taskname: string, path: string): void {
  const TASK = join(path, taskname);
  util.log('Registering server', util.colors.yellow(tildify(TASK)));

  // gulp.task(taskname, (done: any) => {
    const task = normalizeServer(require(TASK), TASK);

    util.log('Starting server', util.colors.yellow(tildify(TASK)));
    const result = task.run();
    if (result && typeof result.catch === 'function') {
      result.catch((e: any) => {
        util.log(`Error while running server`, e);
      });
    }
    return result;
  // });
}

/**
 * This utility method is used to notify that a file change has happened and subsequently calls the `changed` method,
 * which itself initiates a BrowserSync reload.
 * @param {any} e - The file that has changed.
 */
export function notifyLiveReload(e: any) {
  let fileName = e.path;
  codeChangeTool.changed(fileName);
}

/**
 * Starts a new `express` server, serving the static documentation files.
 */
export function serveDocs() {
  let server = express();

  server.use(
    Config.APP_BASE,
    express.static(resolve(process.cwd(), Config.DOCS_DEST))
  );

  server.listen(Config.DOCS_PORT, () =>
    openResource('http://localhost:' + Config.DOCS_PORT + Config.APP_BASE)
  );
}

/**
 * Starts a new `express` server, serving the static unit test code coverage report.
 */
export function serveCoverage() {
  let server = express();

  server.use(
    Config.APP_BASE,
    express.static(resolve(process.cwd(), Config.COVERAGE_TS_DIR))
  );

  server.listen(Config.COVERAGE_PORT, () =>
    openResource('http://localhost:' + Config.COVERAGE_PORT + Config.APP_BASE)
  );
}

/**
 * Starts a new `express` server, serving the built files from `dist/prod`.
 */
export function serveProd() {
  let root = resolve(process.cwd(), Config.PROD_DEST);
  let server = express();

  // for (let proxy of Config.getProxyMiddleware()) {
  //   server.use(proxy);
  // }

  server.use(Config.APP_BASE, express.static(root));

  server.use(fallback('index.html', {root}));

  server.listen(Config.PORT, () =>
    openResource('http://localhost:' + Config.PORT + Config.APP_BASE)
  );
}

export function startMqtt() {


  //
  //   sails.mqtt.on('clientConnected', function (client) {
  //     sails.log.debug(client.id + " connected");
  //   });
  //
  //   sails.mqtt.on('clientDisconnected', function (client) {
  //     sails.log.debug(client.id + " disconnected");
  //   });
  //
  //   // fired when a message is received
  //   sails.mqtt.on('published', function (packet, client) {
  //     //console.log('Published', packet.payload);
  //     MessageService.handleMessage(sails.moment(), client, packet)
  //   });
  //
  //   sails.mqtt.on('ready',
  //     function setup() {
  //       sails.log.info('Mosca server is up and running');
  //
  //       if (cb) {
  //         cb();
  //       }
  //     }
  //   );
  // }
}
