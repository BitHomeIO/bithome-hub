import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {MessagesComponent} from './messages.component';
import {MomentModule} from 'angular2-moment';
import {MessagesRoutingModule} from './messages-routing.module';
import {EventMessageTypeRendererComponent} from './event-message-type-renderer.component';
import {AgGridModule} from 'ag-grid-angular/main';

@NgModule({
  imports: [
    CommonModule,
    MessagesRoutingModule,
    AgGridModule.withComponents([]),
    MomentModule
  ],
  declarations: [
      MessagesComponent,
    EventMessageTypeRendererComponent
  ],
  exports: [MessagesComponent],
  entryComponents: [EventMessageTypeRendererComponent]
})

export class MessagesModule {
}
