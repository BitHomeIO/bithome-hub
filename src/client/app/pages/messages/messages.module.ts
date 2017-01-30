import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {MessagesComponent} from './messages.component';
import {AgGridModule} from 'ag-grid-ng2/main';
import {MomentModule} from 'angular2-moment';
import {MessagesRoutingModule} from './messages-routing.module';

@NgModule({
  imports: [
    CommonModule,
    MessagesRoutingModule,
    AgGridModule,
    MomentModule
  ],
  declarations: [MessagesComponent],
  exports: [MessagesComponent]
})

export class MessagesModule {
}
