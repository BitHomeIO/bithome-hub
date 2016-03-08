import {Injectable, bind} from 'angular2/core';
import {Bridge} from '../models/bridge';
import {Subject} from 'rxjs/Subject';
import {Observable} from 'rxjs/Observable';
import {Operator} from 'rxjs/Operator';
declare var io: any;
import 'rxjs/rx';

@Injectable()
export class BridgeService {

    public bridges$: Observable<Array<Bridge>>;
    private bridgeObserver: any;
    private dataStore: {
        bridges: Array<Bridge>
    };

    constructor() {

        // Create Observable Stream to output our data
        this.bridges$ = new Observable(observer =>
            this.bridgeObserver = observer).share().publishReplay(1000).refCount();

        this.dataStore = { bridges: [] };

        var thisBridgeService: BridgeService = this;

        io.socket.get('/api/bridges', function gotBridge(data) {
            if (data) {
                _.each(data, function (bridgeJson: Bridge) {
                    thisBridgeService.addBridge(thisBridgeService.bridgeFromJson(bridgeJson) );
                });
            }
        });
    }

    public bridgeFromJson(bridgeJson: Bridge): Bridge {
        var bridge: Bridge = new Bridge(
            bridgeJson.createdAt,
            bridgeJson.name,
            bridgeJson.id,
            bridgeJson.status);

        return bridge;
    }

    // an imperative function call to this action stream
    public addBridge(bridge: Bridge): void {
        this.dataStore.bridges.push(bridge);

        this.bridgeObserver.next(this.dataStore.bridges);
    }
}

export var bridgeServiceInjectables: Array<any> = [
    bind(BridgeService).toClass(BridgeService)
];
