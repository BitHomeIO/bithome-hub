import {Component} from 'angular2/core';
import {NodeList} from '../node-list/node-list';

@Component({
    selector: 'nodes',
    directives: [NodeList],
    template: `
        <h1>Nodes:</h1>
        <node-list></node-list>

    `,
})
export class Nodes {

}

