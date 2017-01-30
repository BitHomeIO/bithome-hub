import {NotificationIcons} from './notification.icons';

export interface NotificationOptions {
    timeOut?: number;
    showProgressBar?: boolean;
    pauseOnHover?: boolean;
    lastOnBottom?: boolean;
    clickToClose?: boolean;
    maxLength?: number;
    maxStacks?: number;
    preventDuplicates?: number;
    preventLastDuplicates?: boolean | string;
    theClass?: string;
    rtl?: boolean;
    animate?: 'fromRight' | 'fromLeft' | 'rotate' | 'scale' | 'fromTop';
    icons?: NotificationIcons;
    position?: ['top' | 'bottom', 'right' | 'left'];
}
