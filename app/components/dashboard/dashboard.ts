import {Component} from 'angular2/core';
import {OnInit} from 'angular2/core';
import {ElementRef} from 'angular2/core';
import {DashboardItem} from '../dashboard-item/dashboard-item';
declare var jQuery: any;
import 'gridstack';


@Component({
    selector: 'dashboard',
    providers: [ElementRef],
    directives: [DashboardItem],
    templateUrl: 'app/components/dashboard/dashboard.html',
    styleUrls: ['app/components/dashboard/dashboard.css'],
})
export class Dashboard implements OnInit {

    constructor(private elementRef: ElementRef) {

    }

    public ngOnInit(): void {
        var options: any = {
            cellHeight: 80,
            verticalMargin: 10
        };

        jQuery(this.elementRef.nativeElement).find('.grid-stack').gridstack(options);
    }

}

