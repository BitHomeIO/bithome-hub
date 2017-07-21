import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {APP_BASE_HREF} from '@angular/common';
import {HttpModule} from '@angular/http';
import {AppComponent} from './app.component';
import {AppRoutingModule} from './app-routing.module';

import {AboutModule} from './about/about.module';
import {HomeModule} from './home/home.module';
import {SharedModule} from './shared/shared.module';
import {NotificationService} from './service/notification.service';
import {ApiService} from './service/api.service';
import {ConfigService} from './service/config.service';
import {WebSocketService} from './service/websocket.service';
import {AuthService} from './service/auth.service';
import {InternalLayoutModule} from './layout/internal/internal-layout.module';
import {BsDropdownModule} from 'ng2-bootstrap';
import {reducer} from './reducers/index.reducer';
import {StoreModule} from '@ngrx/store';
import {StoreRouterConnectingModule, routerReducer} from '@ngrx/router-store';
import {BootstrapModalModule} from 'angular2-modal/plugins/bootstrap';
import {MessagesModule} from './pages/messages/messages.module';
import {MessageService} from './service/message.service';
import {AgGridModule} from 'ag-grid-angular/main';

@NgModule({
  imports: [
    BrowserModule,
    HttpModule,
    AppRoutingModule,
    StoreModule.forRoot({routerReducer: routerReducer}),
    StoreRouterConnectingModule,
    BootstrapModalModule,
    BsDropdownModule.forRoot(),
    AgGridModule.withComponents([]),
    InternalLayoutModule,
    AboutModule,
    HomeModule,
    MessagesModule,
    SharedModule.forRoot()
  ],
  declarations: [AppComponent],
  providers: [
    {
      provide: APP_BASE_HREF,
      useValue: '<%= APP_BASE %>'
    },
    NotificationService,
    ApiService,
    ConfigService,
    WebSocketService,
    MessageService,
    AuthService
  ],
  bootstrap: [AppComponent]

})
export class AppModule {
}
