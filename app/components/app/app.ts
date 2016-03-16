import {Component} from 'angular2/core';
import {Messages} from '../messages/messages';
import {Observable} from 'rxjs/Observable';
import {utilInjectables} from '../../util/util';
import {serviceInjectables} from '../../services/service';
import {bootstrap} from 'angular2/platform/browser';
import {Router} from 'angular2/router';
import {ROUTER_PROVIDERS} from 'angular2/router';
import {HashLocationStrategy} from 'angular2/router';
import {LocationStrategy} from 'angular2/router';
import {RouteConfig} from 'angular2/router';
import {provide} from 'angular2/core';
import {ROUTER_DIRECTIVES} from 'angular2/router';
import {Nodes} from '../nodes/nodes';
import {Bridges} from '../bridges/bridges';
import {Dashboards} from '../dashboards/dashboards';

@Component({
    directives: [ROUTER_DIRECTIVES],
    selector: 'bithome-app',
    templateUrl: 'app/components/app/app.html',
    styleUrls: ['app/components/app/app.css']

})
@RouteConfig([
    { path: '/',            name: 'root',       redirectTo: ['Messages'] },
    { path: '/dashboards',  name: 'Dashboards', component: Dashboards  },
    { path: '/messages',    name: 'Messages',   component: Messages  },
    { path: '/bridges',     name: 'Bridges',    component: Bridges  },
    { path: '/nodes',       name: 'Nodes',      component: Nodes  }
])
export class App {
    constructor(public router: Router) {
    }
}

bootstrap(App, [ROUTER_PROVIDERS, serviceInjectables, utilInjectables,
    provide(LocationStrategy, {useClass: HashLocationStrategy})]);
