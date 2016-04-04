import {Component, ElementRef, ChangeDetectorRef, QueryList, Query, AfterViewInit, NgZone} from 'angular2/core';
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
    private itemsInitialized:number;
    private size:string;

    constructor(private elementRef:ElementRef,
                private nodeService:NodeService,
                private changeDetector: ChangeDetectorRef,
                private params:RouteParams,
                private window: Window) {
        this.nodeId = params.get('nodeId');
        this.capabilities = new Array<string>();
        this.itemsInitialized = 0;

        // window.onresize = () => {
        //     this.onResize();
        // };
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

    private isBreakpoint(size: string): boolean {
        return jQuery('.device-' + size).is(':visible');
    }

    private onResize(): void {
        if (this.isBreakpoint('xs')) {
            if (this.size !== 'xs') {
                this.size = 'xs';
                this.grid.destroy();
                console.log('Setting grid width to xs');
                this.initGrid();
            }
            // this.grid.setGridWidth(1);
            // } else if (this.isBreakpoint('sm')) {
            //     // this.grid.setGridWidth(1);
            //     console.log('Setting grid width to sm');
            // } else if (this.isBreakpoint('md')) {
            //     // this.grid.setGridWidth(12);
            //     console.log('Setting grid width to md');
            // } else if (this.isBreakpoint('lg')) {
            //     // this.grid.setGridWidth(12);
            //     console.log('Setting grid width to lg');
        } else {
            if (this.size !== 'lg') {
                this.size = 'lg';
                console.log('Setting grid width to lg');
                this.grid.destroy();
                this.initGrid();
            }
        }
    }

    private initGrid(): void {
        var options:any = {
            cellHeight: 40,
            cellWidth: 40,
            verticalMargin: 10
        };

        this.grid = jQuery(this.elementRef.nativeElement).find('.grid-stack').gridstack(options).data('gridstack');
    }
}

