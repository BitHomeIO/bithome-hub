import {bootstrap}    from 'angular2/platform/browser';
import {App} from './app';

/*
 * Injectables
 */
import {serviceInjectables} from './services/service';
import {utilInjectables} from './util/util';

bootstrap(App, [ serviceInjectables, utilInjectables ]);
