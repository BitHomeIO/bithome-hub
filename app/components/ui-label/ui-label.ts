import {Component, Input, ChangeDetectionStrategy} from 'angular2/core';

@Component({
    selector: 'ui-label',
    changeDetection: ChangeDetectionStrategy.CheckAlways,
    templateUrl: 'app/components/ui-label/ui-label.html',
    styleUrls: ['app/components/ui-label/ui-label.css']
})
export class UiLabel {

    @Input('value') value:string;
    @Input('suffix') suffix:string;
    @Input('prefix') prefix:string;
}

