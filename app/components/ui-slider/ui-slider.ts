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

@Component({
    selector: 'ui-slider',
    templateUrl: 'app/components/ui-slider/ui-slider.html',
    styleUrls: ['app/components/ui-slider/ui-slider.css']
})
export class UiSlider implements AfterViewInit {

    @Input('slider-min') minValue: number;
    @Input('slider-max') maxValue: number;
    @Output() changed: EventEmitter<any> = new EventEmitter();

    constructor(private actionService: ActionService,
                private elementRef: ElementRef) {
    }

    public ngAfterViewInit(): void {
        var inputRef: any  = jQuery(this.elementRef.nativeElement).find('.bh-ui-slider input');
        var comp = this;
        inputRef.slider({min: this.minValue, max: this.maxValue});
        inputRef.on('change',
            (event: any) => {
                this.changed.emit(event.value.newValue);
            }
        );
    }
}

