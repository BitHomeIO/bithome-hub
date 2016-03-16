import {Component} from 'angular2/core';
import {Dashboard} from '../dashboard/dashboard';

@Component({
    selector: 'dashboards',
    directives: [Dashboard],
    templateUrl: 'app/components/dashboards/dashboards.html',
    styleUrls: ['app/components/dashboards/dashboards.css']
})
export class Dashboards {
}

