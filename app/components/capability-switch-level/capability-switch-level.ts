import {Component} from 'angular2/core';
import {UiSlider} from '../ui-slider/ui-slider';
import {Output} from 'angular2/core';
import {EventEmitter} from 'angular2/core';
import {Capability} from '../capability/capability';

@Component({
    selector: 'capability-switch-level',
    directives: [UiSlider],
    templateUrl: 'app/components/capability-switch-level/capability-switch-level.html',
    styleUrls: ['app/components/capability-switch-level/capability-switch-level.css']
})
export class CapabilitySwitchLevel implements Capability {

    @Output() executed: EventEmitter<String[]> = new EventEmitter<String[]>();

    public onSliderChanged(event: number) {
       this.executed.emit([event.toString()]);
    }

    public getExecutedEvent(): EventEmitter<String[]> {
        return this.executed;
    }

    public updateValues(values:string[]):void {
        // noop
    }

    getName():string {
        return 'Switch Level';
    }

    getHeight():number {
        return 2;
    }

    getWidth():number {
        return 3;
    }
}

