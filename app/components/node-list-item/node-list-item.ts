import {Component} from 'angular2/core';
import {Node} from '../../models/node';

@Component({
    inputs: ['node'],
    selector: 'node-list-item',
    template: `
        <div>
            [{{node.createdAt}}] {{node.nodeId}}
        </div>

    `,
})
export class NodeListItem {
    private node: Node;
}

