import {Component} from 'angular2/core';

@Component({
    selector: 'dashboard-item',
    templateUrl: 'app/components/dashboard-item/dashboard-item.html',
    styleUrls: ['app/components/dashboard-item/dashboard-item.css'],
    host: {
        'class': 'grid-stack-item'
    }
})
export class DashboardItem {
}

