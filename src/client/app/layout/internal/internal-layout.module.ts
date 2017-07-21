import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {InternalLayoutComponent} from './internal-layout.component';
import {RouterModule} from '@angular/router';
import {BreadcrumbsComponent} from '../../directives/breadcrumb.component';
import {SmartResizeDirective} from '../../directives/smart-resize.directive';
import {BsDropdownModule} from 'ng2-bootstrap';
import {AlertNotificationModule} from '../../components/alert-notification/alert-notification.module';
import {SIDEBAR_TOGGLE_DIRECTIVES} from '../../directives/sidebar.directive';
import {SideBarModule} from '../../shared/sidebar/sidebar.module';

@NgModule({
  imports: [
    BrowserModule,
    AlertNotificationModule,
    BsDropdownModule.forRoot(),
    RouterModule,
    SideBarModule

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
