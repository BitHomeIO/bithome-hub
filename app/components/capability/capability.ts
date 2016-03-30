import {EventEmitter} from 'angular2/core';

export interface Capability {
    getExecutedEvent(): EventEmitter<String[]>;
    getName(): string;
    getHeight(): number;
    getWidth(): number;
}
