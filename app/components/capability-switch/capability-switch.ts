import {Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef} from 'angular2/core';
import {Observable} from 'rxjs/Observable';
import {OnDestroy} from 'angular2/core';

@Component({
    selector: 'capability-switch',
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: 'app/components/capability-switch/capability-switch.html',
    styleUrls: ['app/components/capability-switch/capability-switch.css']
})
export class BridgeList {

    constructor(private ref: ChangeDetectorRef) {

    }
}

