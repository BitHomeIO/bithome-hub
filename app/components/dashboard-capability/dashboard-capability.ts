import {Component, ElementRef, ChangeDetectorRef, QueryList, Query, AfterViewInit} from 'angular2/core';
import {DashboardItem} from '../dashboard-item/dashboard-item';
import {RouteParams} from 'angular2/router';
import {NodeService} from '../../services/NodeService';
import {Node} from '../../models/node';
import * as async from 'async';
import 'gridstack';
import {DashboardInterface} from '../../dashboard-interface/dashboard-interface';

declare var jQuery:any;

@Component({
    selector: 'dashboard-capability',
    providers: [ElementRef],
    directives: [DashboardItem],
    templateUrl: 'app/components/dashboard-capability/dashboard-capability.html',
    styleUrls: ['app/components/dashboard-capability/dashboard-capability.css'],
})
export class DashboardCapability implements DashboardInterface, AfterViewInit {

    private capabilities:string[];
    private nodeId:string;
    private node:Node;
    private grid:any;
    private items: QueryList<DashboardItem>;
    private itemsInitialized:number;

    constructor(private elementRef:ElementRef,
                private nodeService:NodeService,
                private changeDetector: ChangeDetectorRef,
                private params:RouteParams,
                @Query(DashboardItem) items:QueryList<DashboardItem>) {
        this.nodeId = params.get('nodeId');
        this.items = items;
        this.capabilities = new Array<string>();
        this.itemsInitialized = 0;
    }

    public ngAfterViewInit():any {
        this.nodeService.getNode(this.nodeId).then((node:Node) => {
            this.node = node;
            this.setupCapabilities();
        });
    }

    public onItemInitialized(dashboardItem: DashboardItem) {
        this.itemsInitialized++;
        if (this.itemsInitialized === this.capabilities.length) {
            this.initGrid();
        }
    }

    private setupCapabilities() {
        var that = this;
        async.eachSeries(this.node.capabilities.sort(),
            function iteratee(capability, callback) {
                that.capabilities.push(capability);
                callback();
            }, function done() {
                that.changeDetector.detectChanges();
            }
        );
    }

    private initGrid(): void {
        var options:any = {
            cellHeight: 80,
            verticalMargin: 10
        };

        this.grid = jQuery(this.elementRef.nativeElement).find('.grid-stack').gridstack(options).data('gridstack');
    }
}

