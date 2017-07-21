import {Component, OnInit, ViewChild, ViewContainerRef} from '@angular/core';
import {User} from '../../models/user';
import {AuthService} from '../../service/auth.service';
import {Router} from '@angular/router';
import {Overlay} from 'angular2-modal';
import {Store} from '@ngrx/store';
import * as reducers from '../../reducers/index.reducer';
import {Observable} from 'rxjs';

@Component({
    moduleId: module.id,
    selector: 'app-dashboard',
    styleUrls: ['internal-layout.component.css'],
    templateUrl: './internal-layout.component.html'
})
export class InternalLayoutComponent implements OnInit {

    public disabled: boolean = false;
    public currentUser: User;
    private isLoggingOut: boolean = false;

    public status: {isopen: boolean} = {isopen: false};

    // @ViewChild('defaultOverlayTarget', { read: ViewContainerRef }) defaultOverlayTarget: ViewContainerRef;

    showDisconnectedInterrupt$: Observable<boolean>;
    showWebsocketDisconnectedInterrupt$: Observable<boolean>;


    public notificationOptions = {
        timeOut: 3000,
        lastOnBottom: true,
        clickToClose: true,
        maxLength: 0,
        showProgressBar: false,
        pauseOnHover: true,
        preventDuplicates: false,
        preventLastDuplicates: 'visible',
        rtl: false,
        animate: 'fromTop',
        position: ['top']
    };

    constructor(private authService: AuthService,
                private store: Store<reducers.State>) {

        this.showDisconnectedInterrupt$ = this.store.select(reducers.getShowDisconnectInterrupt);
        this.showWebsocketDisconnectedInterrupt$ = this.store.select(reducers.getShowWebsocketDisconnectInterrupt);
    }

    ngOnInit(): void {
        // this.overlay.defaultViewContainer = this.defaultOverlayTarget;

        this.authService.currentUser
            .subscribe(
                (user: User) => {
                    this.currentUser = user;
                });
    }

    logout(): void {
        this.authService.logout().subscribe();
    }
}
