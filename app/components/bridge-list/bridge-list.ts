import {Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef} from 'angular2/core';
import {Bridge} from '../../models/bridge';
import {BridgeService} from '../../services/BridgeService';
import {BridgeListItem} from '../bridge-list-item/bridge-list-item';
import {Observable} from 'rxjs/Observable';
import {OnDestroy} from 'angular2/core';
import {Subscription} from 'rxjs/Subscription';

@Component({
    selector: 'bridge-list',
    directives: [BridgeListItem],
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: 'app/components/bridge-list/bridge-list.html',
    styleUrls: ['app/components/bridge-list/bridge-list.css']
})
export class BridgeList implements OnInit, OnDestroy {
    private bridgesSubscription: Subscription;
    private bridges: Observable<Array<Bridge>>;

    constructor(public bridgeService: BridgeService, private ref: ChangeDetectorRef) {

    }

    public ngOnInit(): void {
        this.bridges = this.bridgeService.bridges$;

        this.bridgesSubscription = this.bridgeService.bridges$.subscribe(
            (bridges) => {
                this.ref.detectChanges();
            }
        );
    }

    public ngOnDestroy(): void {
        if (this.bridgesSubscription) {
            this.bridgesSubscription.unsubscribe();
        }
    }
}

