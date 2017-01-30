import {Injectable, EventEmitter} from '@angular/core';
import {Headers, Response, Http, ResponseType, RequestOptions, ResponseContentType} from '@angular/http';
import {Observable} from 'rxjs/Observable';
import {EmptyObservable} from 'rxjs/observable/EmptyObservable';
import {Subscription} from 'rxjs/Subscription';
import {IntervalObservable} from 'rxjs/observable/IntervalObservable';
import * as appActions from '../actions/app.action';
import * as reducers from '../reducers/index.reducer';
import {Store} from '@ngrx/store';
import {Subject} from 'rxjs/Subject';
import {ConfigService} from './config.service';
import {Serialize} from 'cerialize';
import saveAs = require('file-saver');

class RequestData {
    public url: string;
    public verb: string;
    public withAuth: boolean;

    constructor(url: string, verb: string, withAuth: boolean) {
        this.url = url;
        this.verb = verb;
        this.withAuth = withAuth;
    }
}

@Injectable()
export class ApiService {

    private recoveryIntervalMs: number = 30000;
    private accessToken: string;
    private apiPath: string;
    private wsPath: string;

    public unauthorizedEvent = new EventEmitter(false);

    private recoverySubscription: Subscription = null;

    constructor(private store: Store<reducers.State>,
                private http: Http) {
        this.apiPath = ConfigService.getApiPath();
        this.wsPath = ConfigService.getWebsocketPath();
    }

    public setAccessToken(accessToken: string) {
        this.accessToken = accessToken;
    }

    public getHeaders(): Headers {
        var headers = new Headers();

        headers.append('Content-Type', 'application/json');
        headers.append('Authorization', this.accessToken);

        return headers;
    }

    //   ____  _____ ____ _____    ____      _ _
    //  |  _ \| ____/ ___|_   _|  / ___|__ _| | |___
    //  | |_) |  _| \___ \ | |   | |   / _` | | / __|
    //  |  _ <| |___ ___) || |   | |___ (_| | | \__ \
    //  |_| \_\_____|____/ |_|    \____\__,_|_|_|___/
    //
    // region REST Calls

    public getRequestWithAuth(url: string): Observable<Response> {
        let observable = this.http.get(url,
            {headers: this.getHeaders()})
            .catch((error: Response) => this.handleError(
                error, new RequestData(url, 'get', true))
            );

        return observable;
    }


    public deleteRequestWithAuth(url: string): Observable<Response> {
        let observable = this.http.delete(url,
            {headers: this.getHeaders()})
            .catch((error: Response) => this.handleError(
                error, new RequestData(url, 'delete', true))
            );

        return observable;
    }

    public postRequest(url: string, payload: Object): Observable<Response> {
        let observable = this.http.post(url, Serialize(payload))
            .catch((error: Response) => this.handleError(
                error, new RequestData(url, 'post', true))
            );

        return observable;
    }

    public postRequestWithAuth(url: string, payload: Object): Observable<Response> {
        let observable = this.http.post(url, Serialize(payload),
            {headers: this.getHeaders()})
            .catch((error: Response) => this.handleError(
                error, new RequestData(url, 'post', true))
            );

        return observable;
    }


    public putRequestWithAuth(url: string, payload: Object): Observable<Response> {
        let observable = this.http.put(url, Serialize(payload),
            {headers: this.getHeaders()})
            .catch((error: Response) => this.handleError(
                error, new RequestData(url, 'post', true))
            );

        return observable;
    }

    public getPostDownloadFileWithAuth(url: string, payload: any): Observable<void> {
        let headers = this.getHeaders();
        headers.append('Accept', 'application/octet-stream');

        let options = new RequestOptions({headers: headers, responseType: ResponseContentType.Blob});

        return this.http.post(url, Serialize(payload), options).map(
            (response: Response) => {
                var dispositionHeader = response.headers.get('content-disposition');
                var result = dispositionHeader.split(';')[1].trim().split('=')[1];
                var fileName = result.replace(/"/g, '');
                saveAs(response.blob(), fileName);
            }
        );
    }


    public getDownloadFileWithAuth(url: string): Observable<void> {
        let headers = this.getHeaders();
        headers.append('Accept', 'application/octet-stream');

        let options = new RequestOptions({headers: headers, responseType: ResponseContentType.Blob});

        return this.http.get(url, options).map(
            (response: Response) => {
                var dispositionHeader = response.headers.get('content-disposition');
                var result = dispositionHeader.split(';')[1].trim().split('=')[1];
                var fileName = result.replace(/"/g, '');
                saveAs(response.blob(), fileName);
            }
        );
    }

    // endregion

    /**
     * Handle any error that might come back from the API
     *
     * @param error
     * @returns {any}
     */
    private handleError(error: Response, requestData: RequestData) {

        // If it's an error type returned, the API is probably disconnected
        if (error.type === ResponseType.Error) {
            return this.initiateRecoveryInterval(requestData);
        } else {
            switch (error.status) {
                case 401:
                    return this.handleUnauthorized();
                // case 403:
                //     return this.handleForbidden();
            }
        }

        return Observable.throw(error.json().error || 'Server error');
    }

    /**
     * Handle unauthorized error
     */
    private handleUnauthorized(): Observable<Response> {
        this.unauthorizedEvent.emit();

        return new EmptyObservable<Response>();
    }

    private initiateRecoveryInterval(requestData: RequestData): Observable<Response> {

        var responseSubject: Subject<Response> = new Subject<Response>();

        this.store.dispatch(new appActions.AppDisconnectedState());

        var source = IntervalObservable.create(this.recoveryIntervalMs);

        this.recoverySubscription = source.subscribe(
            () => {
                this.testRecovery();
            }
        );

        this.recoverySubscription.add(
            () => {
                console.log('API recovery successful');

                this.recoverRequest(responseSubject, requestData);
            }
        );

        return responseSubject.asObservable();
    }

    private recoverRequest(responseSubject: Subject<Response>,
                           requestData: RequestData) {
       if (requestData.verb === 'get' && requestData.withAuth) {
            this.getRequestWithAuth(requestData.url).subscribe(
                (response: Response) => {
                    responseSubject.next(response);
                    responseSubject.complete();
                }
            );
       } else {
           responseSubject.complete();
       }
    }

    private testRecovery(): void {
        console.log('Attempting API recovery');

        this.http.get(this.AUTH_ISLOGGEDIN(),
            {headers: this.getHeaders()}).subscribe(
            () => {
                // We got a response so stop the recovery checks
                if (this.recoverySubscription) {
                    this.recoverySubscription.unsubscribe();
                    this.recoverySubscription = null;

                    this.store.dispatch(new appActions.AppReadyAction());
                }
            }
        );
    }

    //   _____           _             _       _
    //  | ____|_ __   __| |_ __   ___ (_)_ __ | |_ ___
    //  |  _| | '_ \ / _` | '_ \ / _ \| | '_ \| __/ __|
    //  | |___| | | | (_| | |_) | (_) | | | | | |_\__ \
    //  |_____|_| |_|\__,_| .__/ \___/|_|_| |_|\__|___/
    //                    |_|

    public AUTH_LOGIN(): string {
        return this.apiPath + '/v1/auth/login';
    }

    public AUTH_LOGOUT(): string {
        return this.apiPath + '/v1/auth/logout';
    }

    public AUTH_ISLOGGEDIN(): string {
        return this.apiPath + '/v1/auth/isLoggedIn';
    }

    public STATUS_HISTORY(): string {
        return this.apiPath + '/v1/device/status/history';
    }

    public DEBUG_HISTORY(): string {
        return this.apiPath + '/v1/device/debug';
    }

    public WEBSOCKET(): string {
        return this.wsPath + '/v1';
    }

    public PROVIDER(): string {
        return this.apiPath + '/v1/provider';
    };

    public PROVIDER_ID(id: string): string {
        return this.apiPath + '/v1/provider/' + encodeURI(id);
    }

    public COMPANY(): string {
        return this.apiPath + '/v1/company';
    };

    public COMPANY_ID(id: string): string {
        return this.apiPath + '/v1/company/' + encodeURI(id);
    }

    public USER(): string {
        return this.apiPath + '/v1/user';
    };

    public USER_ID(id: string): string {
        return this.apiPath + '/v1/user/' + encodeURI(id);
    }

    public STREAM_ARCHIVED_DOWNLOAD(): string {
        return this.apiPath + '/v1/stream/offline';
    }
}
