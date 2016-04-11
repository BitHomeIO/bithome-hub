import {
    Component, ComponentRef, ViewEncapsulation, EventEmitter, Output, ChangeDetectorRef,
    OnDestroy
} from 'angular2/core';
import {CapabilitySwitch} from '../capability-switch/capability-switch';
import {Input} from 'angular2/core';
import {ElementRef} from 'angular2/core';
import {DynamicComponentLoader} from 'angular2/core';
import camelCase from 'camelcase';
import {OnInit} from 'angular2/core';
import {Capability} from '../capability/capability';
import {ActionService} from '../../services/ActionService';
declare var System: any;
import * as _ from 'lodash';
import {Observable} from 'rxjs/Observable';
import {Subscription} from 'rxjs/Subscription';

@Component({
    selector: 'dashboard-item',
    directives: [CapabilitySwitch],
    templateUrl: 'app/components/dashboard-item/dashboard-item.html',
    styleUrls: ['app/components/dashboard-item/dashboard-item.css'],
    encapsulation: ViewEncapsulation.None,
    host: {
        'class': 'grid-stack-item bh-dashboard-item',
        '[attr.data-gs-width]': 'width',
        '[attr.data-gs-min-width]': 'width',
        '[attr.data-gs-height]': 'height',
        '[attr.data-gs-min-height]': 'height',
        '[attr.data-gs-auto-position]': 'autoPosition',
        '[attr.data-gs-x]': 'x',
        '[attr.data-gs-y]': 'y',
    }
})
export class DashboardItem implements OnInit, OnDestroy {
    @Output() public itemInitialized = new EventEmitter();
    @Input() private nodeId: string;
    @Input() private capability: string;
    @Input() private x: number;
    @Input() private y: number;
    @Input() private height: number;
    @Input() private width: number;
    @Input() private autoPosition: boolean;


    private header: string;
    private dynamicComponentLoader: DynamicComponentLoader;
    private elementRef: ElementRef;
    private values: Observable<Array<string>>;
    private valuesSubscription: Subscription;

    constructor(private actionService: ActionService,
                private changeDetector: ChangeDetectorRef,
                dynamicComponentLoader: DynamicComponentLoader,
                elementRef: ElementRef) {
        this.header = 'Control';
        this.x = null;
        this.y = null;
        this.autoPosition = true;
        this.dynamicComponentLoader = dynamicComponentLoader;
        this.elementRef = elementRef;
    }

    public ngOnInit(): void {
        var componentPathPart = 'capability-' + _.kebabCase(this.capability);
        var componentModuleCc = camelCase(componentPathPart);
        var componentModuleName = componentModuleCc.charAt(0).toUpperCase() + componentModuleCc.slice(1);
        var componentPath = '/app/components/'  + componentPathPart + '/' + componentPathPart;

        var configObject: any = {'component': componentModuleName, 'path': componentPath};

            System.import(configObject.path)
                .then(componentModule => componentModule[configObject.component])
                .then(config => this.dynamicComponentLoader.loadIntoLocation(config, this.elementRef, 'content'))
                .then(cmp => this.attachListener(cmp))
                .catch(e => this.error(e));
    }

    public getElementRef(): ElementRef {
        return this.elementRef;
    }

    public getWidth(): number {
        return this.width;
    }

    public getHeight(): number {
        return this.height;
    }

    public ngOnDestroy(): void {
        if (this.valuesSubscription) {
            this.valuesSubscription.unsubscribe();
        }
    }

    private error(exception: any): void {
        console.log('Could not load ui component for ' + this.capability);

        this.itemInitialized.emit(this);
    }

    private attachListener(componentRef: ComponentRef): void {
        var capability: Capability = componentRef.instance;

        this.height = capability.getHeight();
        this.width = capability.getWidth();
        this.header = capability.getName();

        var that = this;
        capability.getExecutedEvent().subscribe(
            function(params: string[]) {
                that.onCapabilityExecuted(params);
            }
        );

        // Listen for new values
        this.values = this.actionService.getValueUpdatesForCapability(this.nodeId, this.capability);


        this.valuesSubscription = this.values.subscribe(
            (values) => {
                capability.updateValues(values);
                that.changeDetector.detectChanges();
            }
        );

        this.changeDetector.detectChanges();

        this.itemInitialized.emit(this);
    }

    private onCapabilityExecuted(params: string[]) {
        this.actionService.executeCapability(this.nodeId, this.capability, params);
    }
}

