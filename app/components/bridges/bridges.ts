import {Component} from 'angular2/core';
import {BridgeList} from '../bridge-list/bridge-list';

@Component({
    selector: 'bridges',
    directives: [BridgeList],
    templateUrl: 'app/components/bridges/bridges.html',
    styleUrls: ['app/components/bridges/bridges.css']
})
export class Bridges {

}

