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

import {reducer} from './reducers/index.reducer';
import {StoreModule} from '@ngrx/store';
import {RouterStoreModule} from '@ngrx/router-store';
import {BootstrapModalModule} from 'angular2-modal/plugins/bootstrap';
import {Ng2BootstrapModule} from 'ng2-bootstrap/ng2-bootstrap';
import {ModalModule} from 'angular2-modal';
import {MessagesModule} from './pages/messages/messages.module';
import {AgGridModule} from 'ag-grid-ng2';

@NgModule({
  imports: [
    BrowserModule,
    HttpModule,
    AppRoutingModule,
    StoreModule.provideStore(reducer),
    RouterStoreModule.connectRouter(),
    BootstrapModalModule,
    AgGridModule.withComponents([]),
    Ng2BootstrapModule.forRoot(),
    ModalModule.forRoot(),
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
    AuthService
  ],
  bootstrap: [AppComponent]

})
export class AppModule {
}
