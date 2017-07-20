import {Component, OnInit, HostListener, OnDestroy, ViewChild} from '@angular/core';
import {GridOptions} from 'ag-grid';
import {Subscription} from 'rxjs';
import * as _ from 'lodash';
import {MessageService} from '../../service/message.service';
import {EventMessage, EventMessageType} from '../../shared/models/events/event.message';
import {EventMessageTypeRendererComponent} from './event-message-type-renderer.component';

@Component({
    moduleId: module.id,
    templateUrl: 'messages.html',
    styleUrls: ['messages.css'],
})

export class MessagesComponent implements OnInit, OnDestroy {
    public gridOptions: GridOptions;
    private messages: EventMessage[] = [];
    private gridReady: boolean = false;
    private subscription: Subscription;

    constructor(private messageService: MessageService) {

        this.gridOptions = <GridOptions>{};
        this.gridOptions.columnDefs = this.createColumnDefs();
        this.gridOptions.rowData = [];
        this.gridOptions.enableColResize = true;
        this.gridOptions.suppressCellSelection = true;
        this.gridOptions.rowHeight = 22;
        this.gridOptions.onGridReady = (() => {
            this.gridReady = true;
            this.gridOptions.api.sizeColumnsToFit();
        });
    }

    ngOnInit(): void {
        this.updateSubscription(null);
        //
        // this.deviceService.getHardwares().subscribe(
        //     hardwareList => {
        //         _.each(hardwareList, (hardware: Hardware) => {
        //             var name = hardware.toString();
        //             var selectItem: SelectItem = new SelectItem({id: hardware.serialNumber, text: name});
        //             this.hardwareSelectList.itemObjects.push(selectItem);
        //             this.hardwareList.push(hardware);
        //         });
        //     },
        //     error => console.error('Error: ' + error)
        // );
    }

    ngOnDestroy(): void {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
    }

    @HostListener('window:resize', ['$event'])
    onResize(event: any) {
        setTimeout(() => {
            this.gridOptions.api.sizeColumnsToFit();
        }, 1000);
    }

    private updateSubscription(serialNumber?: string): void {
        if (this.subscription) {
            this.subscription.unsubscribe();
            this.messages = [];
            if (this.gridReady) {
                this.gridOptions.api.setRowData(this.messages);
            }
        }

        this.subscription = this.messageService.getMessageStream()
            .subscribe(
                (msg: EventMessage) => {
                    this.messages.unshift(msg);
                    if (this.gridReady) {
                        this.gridOptions.api.setRowData(this.messages);
                    }
                }
            );
    }

    private eventTypeCellRenderer(value: number): string {
        return EventMessageType[value].toString();
    }
    //
    // public onSelected(item: SelectItem): void {
    //     this.filterHardwareSerial = item.id;
    //     this.updateSubscription(item.id);
    //     console.log('Filtering by serial: ', item.id);
    // }
    //
    // private dateDisplayCellRenderer(params: any): string {
    //     return new FormatDatePipe().transform(params.value);
    // }
    //
    // private fixedDecimal6CellRenderer(params: any): string {
    //     return new FixedDecimalPipe().transform(params.value, 6);
    // }
    //
    // private versionCellRenderer(params: any): string {
    //     return params.data.versionMajor + '.' + params.data.versionMinor;
    // }
    //
    private createColumnDefs() {
        return [
            {
                headerName: 'Type',
                field: 'eventType',
                width: 100,
                cellRendererFramework: EventMessageTypeRendererComponent
            },
            {headerName: 'Payload', field: 'payload'}
        ];
    }
}
