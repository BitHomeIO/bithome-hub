import {Component} from 'angular2/core';
import {MessageLog} from './components/message-log/message-log';
import {Observable} from 'rxjs/Observable';
import {utilInjectables} from './util/util';
import {serviceInjectables} from './services/service';
import {bootstrap} from 'angular2/platform/browser';
import {Router} from 'angular2/router';
import {ROUTER_PROVIDERS} from 'angular2/router';
import {HashLocationStrategy} from 'angular2/router';
import {LocationStrategy} from 'angular2/router';
import {RouteConfig} from 'angular2/router';
import {provide} from 'angular2/core';
import {ROUTER_DIRECTIVES} from 'angular2/router';
import {Nodes} from './components/nodes/nodes';

@Component({
    directives: [ROUTER_DIRECTIVES, MessageLog],
    selector: 'bithome-app',
    template: `
  <div class="page-header">
    <div class="container">
      <h1>BitHome Hub</h1>
      <div class="navLinks">
        <a [routerLink]="['/Messages']">Messages</a>
        <a [routerLink]="['/Nodes']">Nodes</a>
      </div>
    </div>
  </div>

  <div id="content">
    <div class="container">

      <login></login>

      <hr>

      <router-outlet></router-outlet>
    </div>
  </div>
  `

})
@RouteConfig([
    { path: '/',          name: 'root',      redirectTo: ['Messages'] },
    { path: '/messages',  name: 'Messages',  component: MessageLog  },
    { path: '/nodes',  name: 'Nodes',        component: Nodes  }
])
export class App {
    constructor(public router: Router) {
    }
}

bootstrap(App, [ROUTER_PROVIDERS, serviceInjectables, utilInjectables,
    provide(LocationStrategy, {useClass: HashLocationStrategy})]);
