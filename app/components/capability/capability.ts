import {EventEmitter} from 'angular2/core';

export interface Capability {
    getExecutedEvent(): EventEmitter<String[]>;
    getHeight(): number;
    getWidth(): number;
}
