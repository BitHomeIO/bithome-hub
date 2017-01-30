import {Injectable, EventEmitter, NgZone} from '@angular/core';
import {Http, Headers, Response} from '@angular/http';
import {ApiService} from './api.service';
import {Observable} from 'rxjs/Observable';
import {Subject} from 'rxjs/Subject';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {User} from '../models/user';
import {LoginResponse} from '../models/login-response';
import {Router} from '@angular/router';
import {Location} from '@angular/common';
import * as reducers from '../reducers/index.reducer';
import * as appActions from '../actions/app.action';
import {Store} from '@ngrx/store';
import {StatusResponse} from '../models/status-response';
import {Deserialize} from 'cerialize';

@Injectable()
export class AuthService {
    public currentUser: Subject<User> = new BehaviorSubject<User>(null);

    private defaultRoute: string = '/hardware';
    private storedRoute: string = null;

    private accessToken: string;
    private user: User;

    private headers = new Headers();

    private locationWatcher = new EventEmitter();


    constructor(private apiService: ApiService,
                private http: Http,
                private router: Router,
                private store: Store<reducers.State>,
                private location: Location) {

        this.headers.append('Content-Type', 'application/json');

        let userString = localStorage.getItem('user');

        if (userString && userString !== '') {
            this.setCurrentUser(JSON.parse(userString));
            this.setAccessToken(localStorage.getItem('access_token'));
        }

        // Handle unauthorized events coming back from the API
        this.apiService.unauthorizedEvent.subscribe(
            () => {
                this.logout().subscribe();

            }
        );
    }


    /**
     * Login with an email and password
     */
    public login(email: string, password: string): Observable<void> {

        return this.http.post(this.apiService.AUTH_LOGIN(),
            JSON.stringify(
                {
                    email: email,
                    password: password
                }),
            {headers: this.headers}).map((res: any) => {
            let loginResponse: LoginResponse = res.json();
            this.setAccessToken(loginResponse.access_token);
            this.setCurrentUser(loginResponse.user);
            if (this.storedRoute) {
                this.router.navigate([this.storedRoute]);
                this.storedRoute = null;
            } else {
                this.router.navigate([this.defaultRoute]);
            }
        });
    }

    /**
     * Returns a response stating if the user is logged in or not
     */
    public isLoggedIn(): Observable<StatusResponse> {
        return this.http.get(this.apiService.AUTH_ISLOGGEDIN(),
            {headers: this.headers})
            .map(response => response.json)
            .map(response => Deserialize(response, StatusResponse));
    }

    logout(): Observable<void> {
        return this.http.post(this.apiService.AUTH_LOGOUT(),
            {headers: this.headers})
            .map((res: any) => {

                // Get the current router state before navigating
                this.storedRoute = this.getRouterState();

                this.setAccessToken(null);
                this.setCurrentUser(null);
                this.store.dispatch(new appActions.AppLoggedOutState());
                this.location.replaceState(''); // clears browser history so they can't navigate with back button
                this.router.navigate(['/login']);
            })
            .catch(this.handleError);
    }

    isAuthenticated(): boolean {
        return this.accessToken !== undefined && this.user !== undefined && this.accessToken !== 'undefined';
    }

    public subscribe(onNext: (value: any) => void, onThrow?: (exception: any) => void, onReturn?: () => void) {
        return this.locationWatcher.subscribe(onNext, onThrow, onReturn);
    }

    private setCurrentUser(newUser: User): void {
        if (newUser === null) {
            localStorage.removeItem('user');
        } else {
            localStorage.setItem('user', JSON.stringify(newUser));
        }
        this.currentUser.next(newUser);
        this.user = newUser;
    }

    private setAccessToken(accessToken: string): void {
        if (accessToken === null) {
            localStorage.removeItem('access_token');
        } else {
            localStorage.setItem('access_token', accessToken);
        }
        this.accessToken = accessToken;
        this.apiService.setAccessToken(accessToken);
    }

    public getAccessToken(): string {
        return this.accessToken;
    }

    private handleError(error: Response | any) {
        // In a real world app, we might use a remote logging infrastructure
        let errMsg: string;
        if (error instanceof Response) {
            const body = error.json() || '';
            const err = body.error || JSON.stringify(body);
            errMsg = `${error.status} - ${error.statusText || ''} ${err}`;
        } else {
            errMsg = error.message ? error.message : error.toString();
        }
        console.error(errMsg);
        return Observable.throw(errMsg);
    }

    private getRouterState(): string {
        return this.router.url;
    }
}
