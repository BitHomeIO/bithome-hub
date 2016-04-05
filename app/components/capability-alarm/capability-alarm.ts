import {Component} from 'angular2/core';
import {UiButton} from '../ui-button/ui-button';
import {Output} from 'angular2/core';
import {EventEmitter} from 'angular2/core';
import {Capability} from '../capability/capability';

@Component({
    selector: 'capability-alarm',
    directives: [UiButton],
    templateUrl: 'app/components/capability-alarm/capability-alarm.html',
    styleUrls: ['app/components/capability-alarm/capability-alarm.css']
})
export class CapabilityAlarm implements Capability {

    @Output() executed: EventEmitter<String[]> = new EventEmitter<String[]>();

    public onClicked(event: boolean) {
       this.executed.emit(['both']);
    }

    public getExecutedEvent(): EventEmitter<String[]> {
        return this.executed;
    }

    public updateValues(values:string[]):void {
        // noop
    }

    getName():string {
        return 'Alarm';
    }

    getHeight():number {
        return 2;
    }

    getWidth():number {
        return 2;
    }
}

