import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {AlertNotificationComponent} from './alert-notification.component';
import {NotificationComponent} from '../notification/notification.component';
import {MaxPipe} from '../notification/max.pipe';
import {NotificationService} from '../../service/notification.service';

@NgModule({
  imports: [CommonModule],
  declarations: [AlertNotificationComponent, NotificationComponent, MaxPipe],
  providers: [NotificationService],
  exports: [AlertNotificationComponent]
})
export class AlertNotificationModule {
}
