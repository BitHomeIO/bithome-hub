import {Component} from 'angular2/core';
import {UiSlider} from '../ui-slider/ui-slider';
import {Output} from 'angular2/core';
import {ActionExecuteEvent} from '../../models/action-execute-event';
import {EventEmitter} from 'angular2/core';
import {Capability} from '../capability/capability';

@Component({
    selector: 'capability-color-control-rgb',
    directives: [UiSlider],
    templateUrl: 'app/components/capability-color-control-rgb/capability-color-control-rgb.html',
    styleUrls: ['app/components/capability-color-control-rgb/capability-color-control-rgb.css']
})
export class CapabilityColorControlRgb implements Capability {
    @Output() executed: EventEmitter<String[]> = new EventEmitter();

    private red: number;
    private green: number;
    private blue: number;

    constructor() {
        this.red = 0;
        this.green = 0;
        this.blue = 0;
    }

    public onRedChanged(event: number) {
        this.red = event;
        this.executed.emit([this.red.toString(), this.green.toString(), this.blue.toString()]);
    }

    public onGreenChanged(event: number) {
        this.green = event;
        this.executed.emit([this.red.toString(), this.green.toString(), this.blue.toString()]);
    }

    public onBlueChanged(event: number) {
        this.blue = event;
        this.executed.emit([this.red.toString(), this.green.toString(), this.blue.toString()]);
    }

    public getExecutedEvent(): EventEmitter<String[]> {
        return this.executed;
    }
}
