import {Component} from 'angular2/core';
import {UiSwitch} from '../ui-switch/ui-switch';
import {Output} from 'angular2/core';
import {EventEmitter} from 'angular2/core';
import {Capability} from '../capability/capability';

@Component({
    selector: 'capability-switch',
    directives: [UiSwitch],
    templateUrl: 'app/components/capability-switch/capability-switch.html',
    styleUrls: ['app/components/capability-switch/capability-switch.css']
})
export class CapabilitySwitch implements Capability {

    @Output() executed: EventEmitter<String[]> = new EventEmitter<String[]>();

    private value: boolean = true;

    public onSwitchChanged(event: boolean) {
       this.executed.emit([event ? 'on' : 'off']);
    }

    public getExecutedEvent(): EventEmitter<String[]> {
        return this.executed;
    }

    public updateValues(values:string[]):void {
        if (values.length === 1) {
           this.value = (values[0] === 'on');
        }
    }

    getName():string {
        return 'Switch';
    }

    getHeight():number {
        return 2;
    }

    getWidth():number {
        return 2;
    }
}

