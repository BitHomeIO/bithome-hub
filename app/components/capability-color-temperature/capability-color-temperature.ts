import {Component} from 'angular2/core';
import {UiSlider} from '../ui-slider/ui-slider';
import {Output} from 'angular2/core';
import {ActionExecuteEvent} from '../../models/action-execute-event';
import {EventEmitter} from 'angular2/core';
import {Capability} from '../capability/capability';

@Component({
    selector: 'capability-color-temperature',
    directives: [UiSlider],
    templateUrl: 'app/components/capability-color-temperature/capability-color-temperature.html',
    styleUrls: ['app/components/capability-color-temperature/capability-color-temperature.css']
})
export class CapabilityColorTemperature implements Capability {

    @Output() executed: EventEmitter<String[]> = new EventEmitter();

    public onSliderChanged(event: number) {
       this.executed.emit([event.toString()]);
    }

    public getExecutedEvent(): EventEmitter<String[]> {
        return this.executed;
    }
}

