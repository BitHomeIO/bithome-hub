import {Component, DoCheck} from 'angular2/core';
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
export class UiSlider implements AfterViewInit, DoCheck  {

    @Input('slider-min') minValue: number;
    @Input('slider-max') maxValue: number;
    @Input('slider-value') value: number;
    @Output() changed: EventEmitter<any> = new EventEmitter();

    private inputRef: any;
    private isSliding: boolean = false;

    constructor(private actionService: ActionService,
                private elementRef: ElementRef) {
    }

    public ngDoCheck():any {
        if (!this.isSliding && this.inputRef && this.inputRef.slider('getValue') !== this.value) {
            this.inputRef.slider('setValue', this.value);
        }
    }

    public ngAfterViewInit(): void {
        this.inputRef = jQuery(this.elementRef.nativeElement).find('input');
        var comp = this;
        this.inputRef.slider({min: this.minValue, max: this.maxValue, value: this.value});
        var throttled =  _.throttle(this.emitChange, 250, { 'trailing': true });

        this.inputRef.on('change',
            (event: any) => {
                throttled(comp, event.value.newValue);
            }
        );

        this.inputRef.on('slideStart',
            () => {
                this.isSliding = true;
            }
        );

        this.inputRef.on('slideStop',
            () => {
                this.isSliding = false;
            }
        );
    }

    public emitChange(comp, value): void {
        comp.changed.emit(value);
    }
}

