import {Component} from 'angular2/core';
import {CapabilitySwitch} from '../capability-switch/capability-switch';
import {CapabilitySlider} from '../capability-slider/capability-slider';
import {HostBinding} from 'angular2/core';
import {Input} from 'angular2/core';
import {ElementRef} from 'angular2/core';
import {DynamicComponentLoader} from 'angular2/core';
import camelCase from 'camelcase';
import {OnInit} from 'angular2/core';
declare var System: any;

@Component({
    selector: 'dashboard-item',
    directives: [CapabilitySwitch, CapabilitySlider],
    templateUrl: 'app/components/dashboard-item/dashboard-item.html',
    styleUrls: ['app/components/dashboard-item/dashboard-item.css'],
    host: {
        'class': 'grid-stack-item',
        '[attr.data-gs-width]': 'width',
        '[attr.data-gs-min-width]': 'width',
        '[attr.data-gs-height]': 'height',
        '[attr.data-gs-min-height]': 'height',
        '[attr.data-gs-x]': 'x',
        '[attr.data-gs-y]': 'y',
    }
})
export class DashboardItem implements OnInit {
    @Input() private capability: string;
    @Input() private x: number;
    @Input() private y: number;
    @Input() private height: number;
    @Input() private width: number;

    private dynamicComponentLoader: DynamicComponentLoader;
    private elementRef: ElementRef;

    constructor(dynamicComponentLoader: DynamicComponentLoader, elementRef: ElementRef) {
        this.dynamicComponentLoader = dynamicComponentLoader;
        this.elementRef = elementRef;
    }

    public ngOnInit(): void {
        //
        var componentPathPart = 'capability-' + this.capability;
        var componentModuleCc = camelCase(componentPathPart);
        var componentModuleName = componentModuleCc.charAt(0).toUpperCase() + componentModuleCc.slice(1);
        var componentPath = '/app/components/'  + componentPathPart + '/' + componentPathPart;

        var configObject: any = {'component': componentModuleName, 'path': componentPath};

        System.import(configObject.path)
            .then(componentModule => componentModule[configObject.component])
            .then(config => this.dynamicComponentLoader.loadIntoLocation(config, this.elementRef, 'content'));
    }
}

