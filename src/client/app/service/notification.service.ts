import {Injectable} from '@angular/core';
import {Subject} from 'rxjs/Subject';
import {NotificationEvent} from '../components/notification/notification-event.type';
import {Notification} from '../components/notification/notification.type';
import {NotificationIcons, defaultNotificationIcons} from '../components/notification/notification.icons';

@Injectable()
export class NotificationService {

  private emitter: Subject<NotificationEvent> = new Subject<NotificationEvent>();
  private icons: NotificationIcons = defaultNotificationIcons;

  set(notification: Notification, to: boolean) {
    notification.id = notification.override && notification.override.id ?
        notification.override.id : Math.random().toString(36).substring(3);
    this.emitter.next({command: 'set', notification: notification, add: to});
    return notification;
  };

  getChangeEmitter() {
    return this.emitter;
  }

  //// Access methods
  successWithTitle(title: string, content: string, override?: any) {
    return this.set({
      title: title,
      content: content,
      type: 'success',
      icon: this.icons.success,
      override: override
    }, true);
  }

  success(content: string, override?: any) {
    return this.set({
      title: null,
      content: content,
      type: 'success',
      icon: this.icons.success,
      override: override
    }, true);
  }

  error(content: string, override?: any) {
    return this.set({title: null, content: content, type: 'error', icon: this.icons.error, override: override}, true);
  }

  alert(content: string, override?: any) {
    return this.set({title: null, content: content, type: 'alert', icon: this.icons.alert, override: override}, true);
  }

  info(content: string, override?: any) {
    return this.set({title: null, content: content, type: 'info', icon: this.icons.info, override: override}, true);
  }

  errorWithTitle(title: string, content: string, override?: any) {
    return this.set({title: title, content: content, type: 'error', icon: this.icons.error, override: override}, true);
  }

  alertWithTitle(title: string, content: string, override?: any) {
    return this.set({title: title, content: content, type: 'alert', icon: this.icons.alert, override: override}, true);
  }

  infoWithTitle(title: string, content: string, override?: any) {
    return this.set({title: title, content: content, type: 'info', icon: this.icons.info, override: override}, true);
  }

  bare(title: string, content: string, override?: any) {
    return this.set({title: title, content: content, type: 'bare', icon: 'bare', override: override}, true);
  }

  // With type method
  create(title: string, content: string, type: string, override?: any) {
    return this.set({title: title, content: content, type: type, icon: 'bare', override: override}, true);
  }

  // HTML Notification method
  html(html: any, type: string, override?: any) {
    return this.set({html: html, type: type, icon: 'bare', override: override, title: null, content: null}, true);
  }

  // Remove all notifications method
  remove(id?: string) {
    if (id) {
      this.emitter.next({command: 'clean', id: id});
    } else {
      this.emitter.next({command: 'cleanAll'});
    }
  }
}
