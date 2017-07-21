import {Component} from '@angular/core';
import {EventMessageType} from '../../shared/models/events/event.message';
import {AgRendererComponent} from 'ag-grid-angular';

@Component({
    template: `{{value}}`
})
export class EventMessageTypeRendererComponent implements AgRendererComponent {
    public value: String;

    agInit(params: any): void {
        this.value = EventMessageType[params.value];
    }
}
