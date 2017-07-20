import {join} from 'path';

import {SeedConfig, BUILD_TYPES} from './seed.config';
import {ExtendPackages} from './seed.config.interfaces';
// import { ExtendPackages } from './seed.config.interfaces';

/**
 * This class extends the basic seed configuration, allowing for project specific overrides. A few examples can be found
 * below.
 */
export class ProjectConfig extends SeedConfig {

  PROJECT_TASKS_DIR = join(process.cwd(), this.TOOLS_DIR, 'tasks', 'project');

  NODE_MODULES = 'node_modules';

  /**
   * The base folder of the applications server source files.
   * @type {string}
   */
  SERVER_SRC = `src/server`;
  SERVER_DEST = ``;

  FONTS_DEST = '';
  FONTS_SRC = [
    'node_modules/font-awesome/fonts/**'
  ];

  constructor() {
    super();


    this.APP_TITLE = 'BitHome Automation';

    // Pub client files in the appropriate client directory
    this.SERVER_DEST = this.APP_DEST + '/server';
    this.APP_DEST = this.APP_DEST + '/client';
    this.JS_DEST = this.APP_DEST + '/js';
    this.CSS_DEST = this.APP_DEST + '/css';
    this.FONTS_DEST = `${this.APP_DEST}/fonts`;

    // this.APP_TITLE = 'Put name of your app here';

    /* Enable typeless compiler runs (faster) between typed compiler runs. */
    // this.TYPED_COMPILE_INTERVAL = 5;

    // Add `NPM` third-party libraries to be injected/bundled.
    this.NPM_DEPENDENCIES = [
      ...this.NPM_DEPENDENCIES,
      {src: 'jquery/dist/jquery.min.js', inject: 'libs'},
      {src: 'tether/dist/js/tether.js', inject: 'libs'},
      {src: 'bootstrap/dist/js/bootstrap.min.js', inject: 'libs'}
      // {src: 'lodash/lodash.min.js', inject: 'libs'},
    ];

    // Add `local` third-party libraries to be injected/bundled.
    this.APP_ASSETS = [
      ...this.APP_ASSETS,
      {src: `${this.CSS_SRC}/main.css`, inject: true, vendor: false},
      {src: `${this.NODE_MODULES}/tether/dist/css/tether.css`, inject: true, vendor: true},
      {src: `${this.NODE_MODULES}/tether/dist/css/tether-theme.basic.css`, inject: true, vendor: true},
      {src: `${this.NODE_MODULES}/ag-grid/dist/styles/ag-grid.css`, inject: true, vendor: false}
      // {src: `${this.APP_SRC}/your-path-to-lib/libs/jquery-ui.js`, inject: true, vendor: false}
      // {src: `${this.CSS_SRC}/path-to-lib/test-lib.css`, inject: true, vendor: false},
    ];


    let additionalPackages: ExtendPackages[] = [
      {
        name: 'lodash',
        path: `${this.NODE_MODULES}/lodash/lodash.js`,
        packageMeta: {
          defaultExtension: 'js'
        }
      },
      {
        name: 'reselect',
        path: `${this.NODE_MODULES}/reselect/dist/reselect.js`,
        packageMeta: {
          defaultExtension: 'js'
        }
      },
      {
        name: '@ngrx/core',
        path: `${this.NODE_MODULES}/@ngrx/core`,
        packageMeta: {
          main: 'bundles/core.umd.js',
          defaultExtension: 'js'
        }
      },
      {
        name: '@ngrx/router-store',
        path: `${this.NODE_MODULES}/@ngrx/router-store`,
        packageMeta: {
          main: 'bundles/router-store.umd.js',
          defaultExtension: 'js'
        }
      },
      {
        name: '@ngrx/store',
        path: `${this.NODE_MODULES}/@ngrx/store`,
        packageMeta: {
          main: 'bundles/store.umd.js',
          defaultExtension: 'js'
        }
      },
      {
        name: 'ng2-bootstrap/ng2-bootstrap',
        path: `${this.NODE_MODULES}/ng2-bootstrap/bundles/ng2-bootstrap.umd.js`,
        packageMeta: {
          defaultExtension: 'js'
        }
      },
      {
        name: 'moment',
        path: `${this.NODE_MODULES}/moment/moment.js`,
        packageMeta: {
          defaultExtension: 'js'
        }
      },
      {
        name: 'moment-timezone',
        path: `${this.NODE_MODULES}/moment-timezone/builds/moment-timezone-with-data.js`,
        packageMeta: {
          defaultExtension: 'js'
        }
      },
      {
        name: 'cerialize',
        path: `${this.NODE_MODULES}/cerialize/index.js`,
        packageMeta: {
          defaultExtension: 'js'
        }
      },
      {
        name: 'async',
        path: `${this.NODE_MODULES}/async/index.js`,
        packageMeta: {
          defaultExtension: 'js'
        }
      },
      {
        name: 'angular2-ladda',
        path: `${this.NODE_MODULES}/angular2-ladda/index.js`,
        packageMeta: {
          defaultExtension: 'js'
        }
      },
      {
        name: 'ladda',
        path: `${this.NODE_MODULES}/ladda/dist/ladda.min.js`,
        packageMeta: {
          main: 'index.js',
          defaultExtension: 'js'
        }
      },
      {
        name: 'spin',
        path: `${this.NODE_MODULES}/ladda/dist/spin.min.js`,
        packageMeta: {
          defaultExtension: 'js'
        }
      },
      {
        name: 'moment',
        path: `${this.NODE_MODULES}/moment/moment.js`,
        packageMeta: {
          defaultExtension: 'js'
        }
      },
      {
        name: 'angular2-moment',
        packageMeta: {
          main: 'index.js',
          defaultExtension: 'js'
        }
      },
      {
        name: 'ag-grid-ng2',
        path: `${this.NODE_MODULES}/ag-grid-ng2/main.js`,
        packageMeta: {
          defaultExtension: 'js'
        }
      },
      {
        name: 'ag-grid',
        path: `${this.NODE_MODULES}/ag-grid/main.js`,
        packageMeta: {
          defaultExtension: 'js'
        }
      },
      {
        name: 'angular2-modal',
        path: `${this.NODE_MODULES}/angular2-modal/bundles/angular2-modal.umd.js`,
        packageMeta: {
          defaultExtension: 'js'
        }
      },
      {
        name: `angular2-modal/plugins/bootstrap`,
        path: `${this.NODE_MODULES}/angular2-modal/bundles/angular2-modal.bootstrap.umd.js`,
        packageMeta: {
          main: 'index.js',
          defaultExtension: 'js'
        }
      },
      {
        name: `file-saver`,
        path: `${this.NODE_MODULES}/file-saver/FileSaver.js`,
        packageMeta: {
          defaultExtension: 'js'
        }
      },
      {
        name: `socket.io-client`,
        path: `${this.NODE_MODULES}/socket.io-client/dist/socket.io.js`,
        packageMeta: {
          defaultExtension: 'js'
        }
      },
      {
        name: `socketio-wildcard`,
        path: `./js/socketio-wildcard.js`,
        packageMeta: {
          defaultExtension: 'js'
        }
      },
    ];


    this.SYSTEM_BUILDER_CONFIG['packageConfigPaths'].push(
      join('node_modules', '@ngrx', '*', 'package.json'),
    );

    this.addPackagesBundles(additionalPackages);

    /* Add to or override NPM module configurations: */
    // this.mergeObject(this.PLUGIN_CONFIGS['browser-sync'], { ghostMode: false });

    this.ENABLE_SCSS = true;

    this.PLUGIN_CONFIGS['browser-sync']['open'] = false;
  }

}
