import {Component} from 'angular2/core';
import {Bridge} from '../../models/bridge';

@Component({
    inputs: ['bridge'],
    selector: 'bridge-list-item',
    templateUrl: 'app/components/bridge-list-item/bridge-list-item.html',
    styleUrls: ['app/components/bridge-list-item/bridge-list-item.css']
})
export class BridgeListItem {
    private bridge: Bridge;
}

