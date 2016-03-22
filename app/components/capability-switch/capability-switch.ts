import {Component} from 'angular2/core';
import {UiSwitch} from '../ui-switch/ui-switch';
import {Output} from 'angular2/core';
import {ActionExecuteEvent} from '../../models/action-execute-event';
import {EventEmitter} from 'angular2/core';
import {Capability} from '../capability/capability';

@Component({
    selector: 'capability-switch',
    directives: [UiSwitch],
    templateUrl: 'app/components/capability-switch/capability-switch.html',
    styleUrls: ['app/components/capability-switch/capability-switch.css']
})
export class CapabilitySwitch implements Capability {

    @Output() executed: EventEmitter<String[]> = new EventEmitter();

    public onSwitchChanged(event: boolean) {
       this.executed.emit([event ? 'on' : 'off']);
    }

    public getExecutedEvent(): EventEmitter<String[]> {
        return this.executed;
    }
}

