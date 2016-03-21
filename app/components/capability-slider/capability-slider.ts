import {Component} from 'angular2/core';
import {Observable} from 'rxjs/Observable';
import {OnDestroy} from 'angular2/core';
declare var jQuery: any;
import 'slider';
import {ElementRef} from 'angular2/core';
import {AfterViewInit} from 'angular2/core';
import {ActionService} from '../../services/ActionService';

@Component({
    selector: 'capability-slider',
    templateUrl: 'app/components/capability-slider/capability-slider.html',
    styleUrls: ['app/components/capability-slider/capability-slider.css']
})
export class CapabilitySlider implements AfterViewInit {

    constructor(private actionService: ActionService,
                private elementRef: ElementRef) {
    }

    public ngAfterViewInit(): void {
        var inputRef: any  = jQuery(this.elementRef.nativeElement).find('.bh-capability-slider input');
        var comp = this;
        inputRef.slider();
        inputRef.on('sliderChange.bootstrapSlider',
            (event: any, state: boolean) => {
               comp.onChange(state);
            }
        );
    }

    public onChange(state: boolean): void {
        var onOff: string = state ? 'on' : 'off';
        this.actionService.executeCapability('00:17:88:01:00:e6:46:68-0b', 'slider', [onOff]);
    }
}

