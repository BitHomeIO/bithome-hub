import {Component} from 'angular2/core';
import {Observable} from 'rxjs/Observable';
import {OnDestroy} from 'angular2/core';
declare var jQuery: any;
import 'slider';
import {ElementRef} from 'angular2/core';
import {AfterViewInit} from 'angular2/core';
import {ActionService} from '../../services/ActionService';
import {EventEmitter} from 'angular2/core';
import {Output} from 'angular2/core';
import {Input} from 'angular2/core';
import * as _ from 'lodash';

@Component({
    selector: 'ui-slider',
    templateUrl: 'app/components/ui-slider/ui-slider.html',
    styleUrls: ['app/components/ui-slider/ui-slider.css']
})
export class UiSlider implements AfterViewInit {

    @Input('slider-min') minValue: number;
    @Input('slider-max') maxValue: number;
    @Input('slider-value') value: number;
    @Output() changed: EventEmitter<any> = new EventEmitter();

    constructor(private actionService: ActionService,
                private elementRef: ElementRef) {
    }

    public ngAfterViewInit(): void {
        var inputRef: any  = jQuery(this.elementRef.nativeElement).find('input');
        var comp = this;
        inputRef.slider({min: this.minValue, max: this.maxValue, value: this.value});
        var throttled =  _.throttle(this.emitChange, 250, { 'trailing': true });

        inputRef.on('change',
            (event: any) => {
                throttled(comp, event.value.newValue);
            }
        );
    }

    public emitChange(comp, value): void {
        comp.changed.emit(value);
    }
}

