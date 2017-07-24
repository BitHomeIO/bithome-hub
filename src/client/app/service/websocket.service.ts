import {Injectable, OnDestroy} from '@angular/core';
import {ApiService} from './api.service';
import {AnonymousSubscription} from 'rxjs/Subscription';
import {Deserialize} from 'cerialize';
import {Subject} from 'rxjs/Subject';
import {Observable} from 'rxjs/Observable';
import {Observer} from 'rxjs/Observer';
import {ReplaySubject} from 'rxjs/ReplaySubject';
import {UsingObservable} from 'rxjs/observable/UsingObservable';
import {IntervalObservable} from 'rxjs/observable/IntervalObservable';
import {Store} from '@ngrx/store';
import * as websocketActions from '../actions/websocket.action';
import * as reducers from '../reducers/index.reducer';
import * as _ from 'lodash';
import * as moment from 'moment';
import * as async from 'async';
import * as io from 'socket.io-client';
import {State} from '../reducers/index.reducer';
import {Subscription} from 'rxjs';
import {EventMessage, EventMessageType} from '../shared/models/events/event.message';

/**
 * Disposable websocket subscription used so that when they are unsubscribed to, they also unsubscribe
 * from the server channel
 */
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

  private wsSubject: Subject<EventMessage>;
  private isOpen: boolean = false;
  private isAuthenticated: boolean = false;
  private reconnectWebsocket$: Observable<boolean>;
  private subscriptionStrings: string[] = [];
  private socket: any;

  //Set up the default 'noop' event handlers
  public onclose: (ev: CloseEvent) => void = function (event: CloseEvent) {
    //noop;
  };
  public onmessage: (ev: any) => void = function (event: any) {
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
        (message: any) => {
          try {
            return Deserialize(JSON.parse(message), EventMessage);
          } catch (e) {
            return null;
          }
        }
      ).filter((message: EventMessage) => {
        return message !== null;
      }).share()
    );
  }

  public subscribeChannel(channel: string, callback?: any): void {
    var that = this;
    async.retry({times: 10, interval: 200},
      (cb: any, results: any) => {

        if (that.isOpen && that.isAuthenticated) {
          cb(null, true);
        } else {
          cb(true);
        }
      },
      (err: any, result: any) => {
        if (!err) {
          that.addSubscriptionString(channel);

          this.socket.emit('subscribe', channel);

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

          this.socket.emit('unsubscribe', channel);
        }
      }
    );
  }

  public getStream(channel: string, ...eventType: EventMessageType[]): Observable<EventMessage> {

    var messageSubject: Subject<EventMessage> = new ReplaySubject<EventMessage>(null);

    this.subscribeChannel(channel,
      (message: EventMessage) => {
        messageSubject.next(message);
      }
    );

    return UsingObservable.create(
      () => new DisposableWebsocketSubscription(this, channel),
      () => messageSubject.filter((message: EventMessage) => {
        return _.includes(eventType, message.eventType);
      })
    );
  }

  public send(requestType: String, data: String): void {
    var event: any = {request_type: requestType, value: data};
    this.wsSubject.next(event);
  }


  private connect(): void {

    this.isAuthenticated = false;

    this.socket = io(this.apiService.WEBSOCKET(),
      {
        transports: ['websocket'],
        path: '/ws',
        secure: false
      });

    this.socket.on('error', (error: String) => {
      console.log('Websocket error: ' + error);
      this.store.dispatch(new websocketActions.WebsocketDisconnectedAction());
    });

    this.socket.on('disconnect', (event: any) => {
      console.log('Websocket close: ' + event);
      this.store.dispatch(new websocketActions.WebsocketDisconnectedAction());
    });

    this.socket.on('authenticated', (event: Event) => {
      console.log('Websocket authenticated.');
      this.isAuthenticated = true;
      this.store.dispatch(new websocketActions.WebsocketConnectedAction());
      this.resubscribeChannels();
    });

    this.socket.on('connect', (event: Event) => {
      console.log('Websocket connect.');
      this.isOpen = true;

      // this.socket.emit('authenticate', this.apiService.accessToken);
    });

    this.socket.on('message', (event: any) => {
      this.onmessage(event);
    });

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
      this.socket.emit('subscribe', channel);
    });
  }
}

