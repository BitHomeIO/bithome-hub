import {Component} from 'angular2/core';
import {NodeList} from '../node-list/node-list';

@Component({
    selector: 'nodes',
    directives: [NodeList],
    templateUrl: 'app/components/nodes/nodes.html',
    styleUrls: ['app/components/nodes/nodes.css']
})
export class Nodes {

}

