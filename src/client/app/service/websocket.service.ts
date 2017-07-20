import {Injectable} from '@angular/core';
import {ApiService} from './api.service';
import {AnonymousSubscription} from 'rxjs/Subscription';
import {Deserialize} from 'cerialize';
import {Subject} from 'rxjs/Subject';
import {Observable} from 'rxjs/Observable';
import {Observer} from 'rxjs/Observer';
import {ReplaySubject} from 'rxjs/ReplaySubject';
import {UsingObservable} from 'rxjs/observable/UsingObservable';
import * as io from 'socket.io-client';
import * as socketiowildcard from 'socketio-wildcard';
import async = require('async');
import {IntervalObservable} from 'rxjs/observable/IntervalObservable';
import {Store} from '@ngrx/store';
import * as websocketActions from '../actions/websocket.action';
import * as reducers from '../reducers/index.reducer';
import * as _ from 'lodash';
import moment = require('moment');
import {State} from '../reducers/index.reducer';
import {Subscription} from 'rxjs';
import {EventMessage, EventMessageType} from '../shared/models/events/event.message';

export class DisposableWebsocketSubscription implements AnonymousSubscription {

    constructor(private webSocketService: WebSocketService,
                private channel: string) {

    }

    unsubscribe(): void {
        this.webSocketService.unsubscribeChannel(this.channel);
    }
}

@Injectable()
export class WebSocketService {

    private heartbeatIntervalMs: number = 5000;
    private heartbeatTimeoutDuration: number = 20000;
    private heartbeatLastSent: number;
    private heartbeatLastRecieved: number;

    private wsSubject: Subject<EventMessage>;
    private isOpen: boolean = false;
    private heartbeatSubscription: Subscription = null;
    private reconnectWebsocket$: Observable<boolean>;
    private subscriptionStrings: string[] = [];
    private socket: SocketIOClient.Socket;

    //Set up the default 'noop' event handlers
    public onclose: (ev: CloseEvent) => void = function (event: CloseEvent) {
        //noop;
    };
    public onmessage: (ev: MessageEvent) => void = function (event: MessageEvent) {
        //noop;
    };
    public onerror: (ev: ErrorEvent) => void = function (event: ErrorEvent) {
        //noop;
    };

    constructor(private apiService: ApiService,
                private store: Store<State>) {

        this.store.dispatch(new websocketActions.WebsocketInitializingAction());
        this.reconnectWebsocket$ = this.store.select(reducers.getReconnectWebsocket);

        this.connect();

        let observable = Observable.create(
            (obs: Observer<MessageEvent>) => {
                this.onmessage = obs.next.bind(obs);
                this.onerror = obs.error.bind(obs);
                this.onclose = obs.complete.bind(obs);
                // return this.ws.close.bind(this.ws);
            });

        let observer = {
            next: (data: Object) => {
                if (this.socket.connected) {
                    if (data !== null) {
                        try {
                            this.socket.send(JSON.stringify(data));
                        } catch (e) {
                            console.log('Could not convert json to send over ws');
                        }
                    }
                }
            },
            error: (error: any) => {
                console.log('websocket error!!');
            }
        };

        this.wsSubject = Subject.create(
            observer,
            observable.map(
                (message: MessageEvent) => {
                    try {
                        let eventMessage = Deserialize(message.data[1], EventMessage);
                        return eventMessage;
                    } catch (e) {
                        return null;
                    }
                }
            ).filter((message: EventMessage) => {
                return message !== null && message.eventType !== null;
            }).share()
        );
    }

    public subscribeChannel(channel: string, callback?: any): void {
        var that = this;
        async.retry({times: 10, interval: 200},
            (cb: any, results: any) => {

                if (that.isOpen) {
                    cb(null, true);
                } else {
                    cb(true);
                }
            },
            (err: any, result: any) => {
                if (!err) {
                    that.addSubscriptionString(channel);
                    var event: any = {request_type: 'SUBSCRIBE', value: channel};
                    that.wsSubject.next(event);

                    if (callback) {
                        that.wsSubject.subscribe(callback);
                    }
                }
            }
        );
    }

    public unsubscribeChannel(channel: string): void {
        var that = this;
        async.retry({times: 10, interval: 200},
            (cb: any, results: any) => {

                if (that.isOpen) {
                    cb(null, true);
                } else {
                    cb(true);
                }
            },
            (err: any, result: any) => {
                if (!err) {
                    that.removeSubscriptionString(channel);
                    var event: any = {request_type: 'UNSUBSCRIBE', value: channel};
                    that.wsSubject.next(event);
                }
            }
        );
    }

    public getStream(channel: string, eventType: EventMessageType): Observable<EventMessage> {


        var messageSubject: Subject<EventMessage> = new ReplaySubject<EventMessage>(null);

        this.subscribeChannel(channel,
            (message: EventMessage) => {
                messageSubject.next(message);
            }
        );

        return UsingObservable.create(
            () => new DisposableWebsocketSubscription(this, channel),
            () => messageSubject.filter((message: EventMessage) => {
                return message.eventType === eventType;
            })
        );
    }

    public HARDWARE_DEBUG_KEY(serialNumber?: string): string {
        return 'hardware:debug:' + serialNumber;
    }

    public HARDWARE_STATUS_KEY(serialNumber?: string): string {
        return 'hardware:status:' + serialNumber;
    }

    public HARDWARE_SURVEY_KEY(serialNumber?: string): string {
        return 'hardware:survey:' + serialNumber;
    }

    private connect(): void {
        if (this.socket) {
            this.socket.close();
        }

        this.socket = io.connect(this.apiService.WEBSOCKET(), {path: '/ws'});

        let wildcard = new socketiowildcard.SocketIOWildcard(io.Manager);
        wildcard.patch(this.socket);

        this.socket.on('error', (event: String) => {
            console.log('Websocket error: ' + event);
            this.store.dispatch(new websocketActions.WebsocketDisconnectedAction());
        });

        this.socket.on('disconnect', () => {
            console.log('Websocket close');
            this.store.dispatch(new websocketActions.WebsocketDisconnectedAction());
        });

        this.socket.on('connect', () => {
            this.isOpen = true;

            this.store.dispatch(new websocketActions.WebsocketConnectedAction());
            this.initiateHeartbeatInterval();
            this.resubscribeChannels();
        });


        this.socket.on('*', (event: any) => {
            this.onmessage(event);
        });
    }

    private initiateHeartbeatInterval(): void {

        if (!this.heartbeatSubscription) {
            // Set up a heartbeat response listener
            this.wsSubject.filter(
                (message: EventMessage) => {
                    return message.eventType === EventMessageType.HEARTBEAT_EVENT;
                }).subscribe(
                (pongMessage: EventMessage) => {
                    this.heartbeatLastRecieved = moment().valueOf();
                }
            );

            // Set up the heartbeat send interval
            var source = IntervalObservable.create(this.heartbeatIntervalMs);

            this.heartbeatSubscription = source.subscribe(
                () => {
                    this.sendHeartbeat();
                }
            );
        }
    }

    private sendHeartbeat(): void {

        // this.reconnectWebsocket$.take(1).subscribe(
        //     (reconnectWebsocket: boolean) => {
        //         if (reconnectWebsocket) {
        //             // Try reconnecting
        //             console.log('[Websocket] reconnecting');
        //             this.connect();
        //         } else {
        //             var event: any = {request_type: 'PING'};
        //             this.wsSubject.next(event);
        //             this.heartbeatLastSent = moment().valueOf();
        //
        //             if ((this.heartbeatLastSent - this.heartbeatLastRecieved > this.heartbeatTimeoutDuration) ||
        //                 !this.socket.connected) {
        //                 this.store.dispatch(new websocketActions.WebsocketDisconnectedAction());
        //             }
        //         }
        //     }
        // );
    }

    private addSubscriptionString(channel: string): void {
        if (_.indexOf(this.subscriptionStrings, channel) === -1) {
            this.subscriptionStrings.push(channel);
        }
    }

    private removeSubscriptionString(channel: string): void {
        _.remove(this.subscriptionStrings, (str: string) => {
            return str === channel;
        });
    }

    private resubscribeChannels(): void {
        _.each(this.subscriptionStrings, (channel: string) => {
            var event: any = {request_type: 'SUBSCRIBE', value: channel};
            this.wsSubject.next(event);
        });
    }
}

