import {Component} from 'angular2/core';
import {UiSlider} from '../ui-slider/ui-slider';
import {Output} from 'angular2/core';
import {EventEmitter} from 'angular2/core';
import {Capability} from '../capability/capability';

@Component({
    selector: 'capability-color-control-hsb',
    directives: [UiSlider],
    templateUrl: 'app/components/capability-color-control-hsb/capability-color-control-hsb.html',
    styleUrls: ['app/components/capability-color-control-hsb/capability-color-control-hsb.css']
})
export class CapabilityColorControlHsb implements Capability {

    @Output() executed: EventEmitter<String[]> = new EventEmitter<String[]>();

    private hue: number;
    private sat: number;
    private bright: number;

    constructor() {
        this.hue = 0;
        this.sat = 0;
        this.bright = 0;
    }

    public onHueChanged(event: number) {
        this.hue = event;
        this.executed.emit([this.hue.toString(), this.sat.toString(), this.bright.toString()]);
    }

    public onSatChanged(event: number) {
        this.sat = event;
        this.executed.emit([this.hue.toString(), this.sat.toString(), this.bright.toString()]);
    }

    public onBrightChanged(event: number) {
        this.bright = event;
        this.executed.emit([this.hue.toString(), this.sat.toString(), this.bright.toString()]);
    }

    public getExecutedEvent(): EventEmitter<String[]> {
        return this.executed;
    }

    public updateValues(values:string[]):void {
        if (values.length === 3) {
            this.hue = parseFloat(values[0]);
            this.sat = parseFloat(values[1]);
            this.bright = parseFloat(values[2]);
        }
    }

    getName():string {
        return 'HSB Color Control';
    }

    getHeight():number {
        return 4;
    }

    getWidth():number {
        return 3;
    }
}

