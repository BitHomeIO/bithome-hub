import {Component} from 'angular2/core';
import {Output} from 'angular2/core';
import {EventEmitter} from 'angular2/core';
import {Capability} from '../capability/capability';
import {UiLabel} from '../ui-label/ui-label';

@Component({
    selector: 'capability-temperature-measurement-c',
    directives: [UiLabel],
    templateUrl: 'app/components/capability-temperature-measurement-c/capability-temperature-measurement-c.html',
    styleUrls: ['app/components/capability-temperature-measurement-c/capability-temperature-measurement-c.css']
})
export class CapabilityTemperatureMeasurementC implements Capability {

    @Output() executed: EventEmitter<String[]> = new EventEmitter<String[]>();

    private value: string = 'N/A';

    public getExecutedEvent(): EventEmitter<String[]> {
        return this.executed;
    }

    public updateValues(values:string[]):void {
        if (values.length === 1) {
            this.value = values[0];
        }
    }

    getName():string {
        return 'Temperature';
    }

    getHeight():number {
        return 2;
    }

    getWidth():number {
        return 2;
    }
}

