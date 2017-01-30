import {Component, OnInit, HostListener, OnDestroy, ViewChild} from '@angular/core';
import {GridOptions} from 'ag-grid';
import {Subscription} from 'rxjs';
import * as _ from 'lodash';

@Component({
    moduleId: module.id,
    templateUrl: 'messages.html',
    styleUrls: ['messages.css'],
})

export class MessagesComponent implements OnInit, OnDestroy {
    public gridOptions: GridOptions;
    // private statuses: DeviceLocationStatus[] = [];
    private gridReady: boolean = false;
    private subscription: Subscription;
    //
    // constructor(private deviceService: DeviceService) {
    //
    //     this.gridOptions = <GridOptions>{};
    //     this.gridOptions.columnDefs = this.createColumnDefs();
    //     this.gridOptions.rowData = [];
    //     this.gridOptions.enableColResize = true;
    //     this.gridOptions.suppressCellSelection = true;
    //     this.gridOptions.rowHeight = 22;
    //     this.gridOptions.onGridReady = (() => {
    //         this.onColumnVisibilityChange();
    //         this.gridReady = true;
    //     });
    // }

    ngOnInit(): void {
        // this.updateSubscription(null);
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
    //
    // @HostListener('window:resize', ['$event'])
    // onResize(event: any) {
    //     // setTimeout(() => {
    //     //     this.gridOptions.api.sizeColumnsToFit();
    //     // }, 1000);
    // }
    //
    // private updateSubscription(serialNumber?: string): void {
    //     if (this.subscription) {
    //         this.subscription.unsubscribe();
    //         this.statuses = [];
    //         if (this.gridReady) {
    //             this.gridOptions.api.setRowData(this.statuses);
    //         }
    //     }
    //
    //     this.subscription = this.deviceService.getStatusStream(serialNumber !== null ? serialNumber : '*')
    //         .subscribe(
    //             (msg: DeviceLocationStatus) => {
    //                 this.statuses.unshift(msg);
    //                 if (this.gridReady) {
    //                     this.gridOptions.api.setRowData(this.statuses);
    //                 }
    //             }
    //         );
    // }
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
    // public onColumnVisibilityChange(): void {
    //     this.gridOptions.columnApi.setColumnVisible('name', this.colVisibleName);
    //     this.gridOptions.columnApi.setColumnVisible('iTowMs', this.colVisibleITow);
    //     this.gridOptions.columnApi.setColumnVisible('fixType', this.colVisibleFix);
    //     this.gridOptions.columnApi.setColumnVisible('flags', this.colVisibleFlags);
    //     this.gridOptions.columnApi.setColumnVisible('numSvs', this.colVisibleSvs);
    //     this.gridOptions.columnApi.setColumnVisible('lon', this.colVisibleLon);
    //     this.gridOptions.columnApi.setColumnVisible('lat', this.colVisibleLat);
    //     this.gridOptions.columnApi.setColumnVisible('height', this.colVisibleHeight);
    //     this.gridOptions.columnApi.setColumnVisible('heightMsl', this.colVisibleHeightMsl);
    //     this.gridOptions.columnApi.setColumnVisible('verticalAcc', this.colVisibleVAcc);
    //     this.gridOptions.columnApi.setColumnVisible('horizontalAcc', this.colVisibleHAcc);
    //     this.gridOptions.columnApi.setColumnVisible('velN', this.colVisibleVelN);
    //     this.gridOptions.columnApi.setColumnVisible('velE', this.colVisibleVelE);
    //     this.gridOptions.columnApi.setColumnVisible('velD', this.colVisibleVelD);
    //     this.gridOptions.columnApi.setColumnVisible('temp', this.colVisibleTemp);
    //     this.gridOptions.columnApi.setColumnVisible('rssi', this.colVisibleRssi);
    //     this.gridOptions.columnApi.setColumnVisible('version', this.colVisibleVersion);
    //     this.gridOptions.columnApi.setColumnVisible('createdAt', this.colVisibleCreated);
    // }
    //
    // private createColumnDefs() {
    //     return [
    //         {headerName: 'Serial', field: 'serialNumber', width: 100},
    //         {headerName: 'Name', field: 'name', width: 100},
    //         {headerName: 'iTowMs', field: 'iTowMs', width: 100},
    //         {headerName: 'Fix', field: 'fixType', width: 50},
    //         {headerName: 'Flags', field: 'flags', width: 50},
    //         {headerName: 'Svs', field: 'numSvs', width: 50},
    //         {headerName: 'Lon', field: 'lon', width: 140, cellRenderer: this.fixedDecimal6CellRenderer},
    //         {headerName: 'Lat', field: 'lat', width: 140, cellRenderer: this.fixedDecimal6CellRenderer},
    //         {headerName: 'Height', field: 'height', width: 100},
    //         {headerName: 'MSL', field: 'heightMsl', width: 100},
    //         {headerName: 'HACC', field: 'horizontalAcc', width: 100},
    //         {headerName: 'VACC', field: 'verticalAcc', width: 100},
    //         {headerName: 'VelN', field: 'velN', width: 100},
    //         {headerName: 'VelE', field: 'velE', width: 100},
    //         {headerName: 'VelD', field: 'velD', width: 100},
    //         {headerName: 'Rssi', field: 'rssi', width: 40},
    //         {headerName: 'Temp', field: 'temp', width: 40},
    //         {headerName: 'Version', width: 100, colId: 'version', cellRenderer: this.versionCellRenderer},
    //         {headerName: 'Created', field: 'createdAt', width: 100, cellRenderer: this.dateDisplayCellRenderer}
    //     ];
    // }
}
