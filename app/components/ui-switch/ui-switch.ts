import {Component, ChangeDetectionStrategy, OnChanges, DoCheck} from 'angular2/core';
declare var jQuery: any;
import 'bootstrapSwitch';
import {ElementRef} from 'angular2/core';
import {AfterViewInit} from 'angular2/core';
import {ActionService} from '../../services/ActionService';
import {Input} from 'angular2/core';
import {Output} from 'angular2/core';
import {EventEmitter} from 'angular2/core';
import {FORM_DIRECTIVES} from 'angular2/common';

@Component({
    selector: 'ui-switch',
    changeDetection: ChangeDetectionStrategy.CheckAlways,
    directives: [FORM_DIRECTIVES],
    templateUrl: 'app/components/ui-switch/ui-switch.html',
    styleUrls: ['app/components/ui-switch/ui-switch.css']
})
export class UiSwitch implements AfterViewInit, DoCheck {

    @Input('switch-off-text') offText: string;
    @Input('switch-on-text') onText: string;
    @Input('value') value: boolean;
    @Output() changed: EventEmitter<any> = new EventEmitter();

    private inputRef: any;

    constructor(private actionService: ActionService,
                private elementRef: ElementRef) {
    }

    public ngDoCheck():any {
        if (this.inputRef) {
            this.inputRef.bootstrapSwitch('state', this.value);
        }
    }

    public ngAfterViewInit(): void {
        this.inputRef = jQuery(this.elementRef.nativeElement).find('.bh-ui-switch input');

        this.inputRef.bootstrapSwitch('size', 'small');
        this.inputRef.bootstrapSwitch('onText', this.onText ? this.onText : 'On');
        this.inputRef.bootstrapSwitch('offText', this.offText ? this.offText : 'Off');
        this.inputRef.on('switchChange.bootstrapSwitch',
            (event: any, state: boolean) => {
                this.changed.emit(state);
            }
        );
    }
}

