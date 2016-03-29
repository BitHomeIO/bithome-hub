import {Component} from 'angular2/core';
import {Node} from '../../models/node';
import {Modal} from 'angular2-modal/dist/angular2-modal';
import {ModalDialogInstance} from 'angular2-modal/dist/angular2-modal';
import {Injector} from 'angular2/core';
import {ICustomModal} from 'angular2-modal/dist/angular2-modal';
import {provide} from 'angular2/core';
import {ModalConfig} from 'angular2-modal/dist/angular2-modal';
import {Renderer} from 'angular2/core';
import {ElementRef} from 'angular2/core';
import {RouterLink} from 'angular2/router';
import {ModalCapability, ModalCapabilityData} from '../modal-capability/modal-capability';

@Component({
    inputs: ['node'],
    providers: [Modal],
    selector: 'node-list-item',
    directives: [RouterLink],
    templateUrl: 'app/components/node-list-item/node-list-item.html',
    styleUrls: ['app/components/node-list-item/node-list-item.css']
})
export class NodeListItem {
    private node: Node;

    constructor(private modal: Modal, private elementRef: ElementRef,
                private injector: Injector, private _renderer: Renderer) {}

    public openCapabilityDialog(capability: string): void {
        let dialog:  Promise<ModalDialogInstance>;
        let component = ModalCapability;

        let bindingData: ModalCapabilityData = new ModalCapabilityData(this.node, capability);

        let bindings = Injector.resolve([provide(ICustomModal, {useValue: bindingData})]);

        this.modal.open(
            <any>component,
            bindings,
            new ModalConfig('sm', true, 27));
    }
}

