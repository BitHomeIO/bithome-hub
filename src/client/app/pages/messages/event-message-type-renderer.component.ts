import {AgRendererComponent} from 'ag-grid-ng2/main';
import {Component} from '@angular/core';
import {EventMessageType} from '../../shared/models/events/event.message';

@Component({
    template: `{{value}}`
})
export class EventMessageTypeRendererComponent implements AgRendererComponent {
    public value: String;

    agInit(params: any): void {
        this.value = EventMessageType[params.value];
    }
}
