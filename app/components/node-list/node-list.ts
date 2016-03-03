import {Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef} from 'angular2/core';
import {Observable} from 'rxjs/Observable';
import {OnDestroy} from 'angular2/core';
import {Subscription} from 'rxjs/Subscription';
import {NodeListItem} from '../node-list-item/node-list-item';
import {NodeService} from '../../services/NodeService';
import {Node} from '../../models/node';

@Component({
    selector: 'node-list',
    directives: [NodeListItem],
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: 'app/components/node-list/node-list.html',
    styleUrls: ['app/components/node-list/node-list.css']
})
export class NodeList implements OnInit, OnDestroy {
    private nodeListSubscription: Subscription;
    private nodes: Observable<Array<Node>>;

    constructor(public nodeService: NodeService, private ref: ChangeDetectorRef) {

    }

    public ngOnInit(): void {

        this.nodes = this.nodeService.nodes$;

        this.nodeListSubscription = this.nodeService.nodes$.subscribe(
            (nodes) => {
                this.ref.detectChanges();
            }
        );
    }

    public ngOnDestroy(): void {
        if (this.nodeListSubscription) {
            this.nodeListSubscription.unsubscribe();
        }
    }
}

