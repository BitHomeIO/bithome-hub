import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {InternalLayoutComponent} from './internal-layout.component';
import {RouterModule} from '@angular/router';
import {BreadcrumbsComponent} from '../../directives/breadcrumb.component';
import {SmartResizeDirective} from '../../directives/smart-resize.directive';
import {Ng2BootstrapModule, DropdownModule} from 'ng2-bootstrap/ng2-bootstrap';
import {AlertNotificationModule} from '../../components/alert-notification/alert-notification.module';
import {SIDEBAR_TOGGLE_DIRECTIVES} from '../../directives/sidebar.directive';

@NgModule({
  imports: [
    BrowserModule,
    AlertNotificationModule,
    Ng2BootstrapModule,
    DropdownModule.forRoot(),
    RouterModule
  ],
  declarations: [
    InternalLayoutComponent,
    SmartResizeDirective,
    SIDEBAR_TOGGLE_DIRECTIVES,
    BreadcrumbsComponent
  ]
})

export class InternalLayoutModule {
}
