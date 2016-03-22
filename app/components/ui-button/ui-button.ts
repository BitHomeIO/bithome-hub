import {Component} from 'angular2/core';
import {Input} from 'angular2/core';
import {Output} from 'angular2/core';
import {EventEmitter} from 'angular2/core';

@Component({
    selector: 'ui-button',
    templateUrl: 'app/components/ui-button/ui-button.html',
    styleUrls: ['app/components/ui-button/ui-button.css']
})
export class UiButton {

    @Input('button-text') buttonText: string;
    @Output() clicked: EventEmitter<any> = new EventEmitter();

    public onClick() {
        this.clicked.emit(null);
    }
}

