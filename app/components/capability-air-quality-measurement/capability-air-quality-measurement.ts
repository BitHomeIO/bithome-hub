import {Component} from 'angular2/core';
import {Output} from 'angular2/core';
import {EventEmitter} from 'angular2/core';
import {Capability} from '../capability/capability';
import {UiLabel} from '../ui-label/ui-label';

@Component({
    selector: 'capability-air-quality-measurement',
    directives: [UiLabel],
    templateUrl: 'app/components/capability-air-quality-measurement/capability-air-quality-measurement.html',
    styleUrls: ['app/components/capability-air-quality-measurement/capability-air-quality-measurement.css']
})
export class CapabilityAirQualityMeasurement implements Capability {

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
        return 'Air Quality';
    }

    getHeight():number {
        return 2;
    }

    getWidth():number {
        return 2;
    }
}

