import {Component} from 'angular2/core';
import {Observable} from 'rxjs/Observable';
import {OnDestroy} from 'angular2/core';
declare var jQuery: any;
import 'bootstrapSwitch';
import {ElementRef} from 'angular2/core';
import {AfterViewInit} from 'angular2/core';
import {ActionService} from '../../services/ActionService';
import {Input} from 'angular2/core';
import {Output} from 'angular2/core';
import {EventEmitter} from 'angular2/core';

@Component({
    selector: 'ui-switch',
    templateUrl: 'app/components/ui-switch/ui-switch.html',
    styleUrls: ['app/components/ui-switch/ui-switch.css']
})
export class UiSwitch implements AfterViewInit {

    @Input('switch-off-text') offText: string;
    @Input('switch-on-text') onText: string;
    @Output() changed: EventEmitter<any> = new EventEmitter();

    constructor(private actionService: ActionService,
                private elementRef: ElementRef) {
    }

    public ngAfterViewInit(): void {
        var inputRef: any  = jQuery(this.elementRef.nativeElement).find('.bh-ui-switch input');

        inputRef.bootstrapSwitch('size', 'small');
        inputRef.bootstrapSwitch('onText', this.onText ? this.onText : 'On');
        inputRef.bootstrapSwitch('offText', this.offText ? this.offText : 'Off');
        inputRef.on('switchChange.bootstrapSwitch',
            (event: any, state: boolean) => {
                this.changed.emit(state);
            }
        );
    }
}

