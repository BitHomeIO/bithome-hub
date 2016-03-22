import {Component} from 'angular2/core';
import {HostBinding} from 'angular2/core';
import {Input} from 'angular2/core';
import {ElementRef} from 'angular2/core';
import {DynamicComponentLoader} from 'angular2/core';
import camelCase from 'camelcase';
import {OnInit} from 'angular2/core';
import {ICustomModalComponent} from 'angular2-modal/dist/angular2-modal';
import {ICustomModal} from 'angular2-modal/dist/angular2-modal';
import {ModalDialogInstance} from 'angular2-modal/dist/angular2-modal';
import {Node} from '../../models/node';
import {ComponentRef} from 'angular2/core';
import {AfterViewInit} from 'angular2/core';
import {Capability} from '../capability/capability';
import {ActionService} from '../../services/ActionService';
import * as _ from 'lodash';
declare var System: any;

export class CapabilityModalData {
    constructor(
        public node: Node,
        public capability: string
    ) {}
}


@Component({
    selector: 'capability-modal',
    templateUrl: 'app/components/capability-modal/capability-modal.html',
    styleUrls: ['app/components/capability-modal/capability-modal.css']
})
export class CapabilityModal implements ICustomModalComponent, OnInit {

    public dialog: ModalDialogInstance;

    private capability: string;
    private node: Node;

    private dynamicComponentLoader: DynamicComponentLoader;
    private elementRef: ElementRef;
    private context: CapabilityModalData;
    private actionService: ActionService;

    constructor(actionService: ActionService,
                dialog: ModalDialogInstance,
                modelContentData: ICustomModal,
                dynamicComponentLoader: DynamicComponentLoader,
                elementRef: ElementRef) {

        this.actionService = actionService;
        this.dynamicComponentLoader = dynamicComponentLoader;
        this.elementRef = elementRef;
        this.dialog = dialog;
        this.context = <CapabilityModalData>modelContentData;

        this.capability = this.context.capability;
        this.node = this.context.node;
    }

    public ngOnInit(): void {
        //
        var componentPathPart = 'capability-' + _.kebabCase(this.capability);
        var componentModuleCc = camelCase(componentPathPart);
        var componentModuleName = componentModuleCc.charAt(0).toUpperCase() + componentModuleCc.slice(1);
        var componentPath = '/app/components/'  + componentPathPart + '/' + componentPathPart;

        var configObject: any = {'component': componentModuleName, 'path': componentPath};

        System.import(configObject.path)
            .then(componentModule => componentModule[configObject.component])
            .then(config => this.dynamicComponentLoader.loadIntoLocation(config, this.elementRef, 'content'))
            .then(cmp => this.attachListener(cmp));
    }


    public beforeDismiss(): boolean {
        return true;
    }

    public beforeClose(): boolean {
        return false;
    }

    public close(): void {
        this.dialog.close();
    }


    private attachListener(componentRef: ComponentRef): void {
        var capability: Capability = componentRef.instance;

        var that = this;
        capability.getExecutedEvent().subscribe(
            function(params: string[]) {
                that.onCapabilityExecuted(params);
            }
        );
    }

    private onCapabilityExecuted(params: string[]) {
        this.actionService.executeCapability(this.node.id, this.capability, params);
    }
}

