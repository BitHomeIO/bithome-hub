import {
  Component, EventEmitter, OnInit, OnDestroy, ViewEncapsulation, Input, Output
}
  from '@angular/core';
import {Subscription} from 'rxjs/Subscription';
import {Notification} from '../notification/notification.type';
import {NotificationOptions} from '../notification/notification.options.type';
import {NotificationService} from '../../services/notification.service';

@Component({
  moduleId: module.id,
  selector: 'alert-notification',
  encapsulation: ViewEncapsulation.None,
  templateUrl: 'alert-notification.html',
  styleUrls: ['alert-notification.css']
})

export class AlertNotificationComponent implements OnInit, OnDestroy {

  @Input() set options(opt: NotificationOptions) {
    this.attachChanges(opt);
  }

  @Output() onCreate = new EventEmitter();
  @Output() onDestroy = new EventEmitter();

  public notifications: Notification[] = [];
  public position: ['top' | 'bottom', 'right' | 'left'] = ['bottom', 'right'];

  public lastNotificationCreated: Notification;
  public listener: Subscription;

  // Received values
  public lastOnBottom: boolean = true;
  public maxStack: number = 8;
  public preventLastDuplicates: any = false;
  public preventDuplicates: boolean = false;

  // Sent values
  public timeOut: number = 0;
  public maxLength: number = 0;
  public clickToClose: boolean = true;
  public showProgressBar: boolean = true;
  public pauseOnHover: boolean = true;
  public theClass: string = '';
  public rtl: boolean = false;
  public animate: 'fromRight' | 'fromLeft' | 'rotate' | 'scale' | 'fromTop' = 'fromRight';

  constructor(private _service: NotificationService) {
  }

  ngOnInit(): void {
    // Listen for changes in the service
    this.listener = this._service.getChangeEmitter()
      .subscribe(item => {
        switch (item.command) {
          case 'cleanAll':
            this.notifications = [];
            break;

          case 'clean':
            this.cleanSingle(item.id);
            break;

          case 'set':
            if (item.add) {
              this.add(item.notification);
            } else {
              this.defaultBehavior(item);
            }
            break;

          default:
            this.defaultBehavior(item);
            break;
        }
      });
  }

  // Default behavior on event
  defaultBehavior(value: any): void {
    this.notifications.splice(this.notifications.indexOf(value.notification), 1);
    this.onDestroy.emit(this.buildEmit(value.notification, false));
  }


  // Add the new notification to the notification array
  add(item: Notification): void {
    item.createdOn = new Date();

    let toBlock: boolean = this.preventLastDuplicates || this.preventDuplicates ? this.block(item) : false;

    // Save this as the last created notification
    this.lastNotificationCreated = item;

    if (!toBlock) {
      // Check if the notification should be added at the start or the end of the array
      if (this.lastOnBottom) {
        if (this.notifications.length >= this.maxStack) this.notifications.splice(0, 1);
        this.notifications.push(item);
      } else {
        if (this.notifications.length >= this.maxStack) {
          this.notifications.splice(this.notifications.length - 1, 1);
        }
        this.notifications.splice(0, 0, item);
      }

      this.onCreate.emit(this.buildEmit(item, true));
    }
  }

  // Check if notifications should be prevented
  block(item: Notification): boolean {

    let toCheck = item.html ? this.checkHtml : this.checkStandard;

    if (this.preventDuplicates && this.notifications.length > 0) {
      for (let i = 0; i < this.notifications.length; i++) {
        if (toCheck(this.notifications[i], item)) {
          return true;
        }
      }
    }

    if (this.preventLastDuplicates) {

      let comp: Notification;

      if (this.preventLastDuplicates === 'visible' && this.notifications.length > 0) {
        if (this.lastOnBottom) {
          comp = this.notifications[this.notifications.length - 1];
        } else {
          comp = this.notifications[0];
        }
      } else if (this.preventLastDuplicates === 'all' && this.lastNotificationCreated) {
        comp = this.lastNotificationCreated;
      } else {
        return false;
      }
      return toCheck(comp, item);
    }

    return false;
  }

  checkStandard(checker: Notification, item: Notification): boolean {
    return checker.type === item.type && checker.title === item.title &&
      checker.content === item.content;
  }

  checkHtml(checker: Notification, item: Notification): boolean {
    return checker.html ? checker.type === item.type && checker.title === item.title &&
      checker.content === item.content && checker.html === item.html : false;
  }

  // Attach all the changes received in the options object
  attachChanges(options: any): void {
    Object.keys(options).forEach((a: any) => {
      var that: any = this;
      if (that.hasOwnProperty(a)) {
        that[a] = options[a];
      }
    });
  }

  buildEmit(notification: Notification, to: boolean) {
    let toEmit: Notification = {
      createdOn: notification.createdOn,
      type: notification.type,
      icon: notification.icon,
      id: notification.id
    };

    if (notification.html) {
      toEmit.html = notification.html;
    } else {
      toEmit.title = notification.title;
      toEmit.content = notification.content;
    }

    if (!to) {
      toEmit.destroyedOn = new Date();
    }

    return toEmit;
  }

  cleanSingle(id: string): void {
    let indexOfDelete: number = 0;
    let doDelete: boolean = false;

    this.notifications.forEach((notification, idx) => {
      if (notification.id === id) {
        indexOfDelete = idx;
        doDelete = true;
      }
    });

    if (doDelete) {
      this.notifications.splice(indexOfDelete, 1);
    }
  }

  ngOnDestroy(): void {
    if (this.listener) {
      this.listener.unsubscribe();
    }
  }
}
