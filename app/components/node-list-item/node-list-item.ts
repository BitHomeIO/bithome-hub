import {Component} from 'angular2/core';
import {Node} from '../../models/node';

@Component({
    inputs: ['node'],
    selector: 'node-list-item',
    templateUrl: 'app/components/node-list-item/node-list-item.html',
    styleUrls: ['app/components/node-list-item/node-list-item.css']
})
export class NodeListItem {
    private node: Node;
}

