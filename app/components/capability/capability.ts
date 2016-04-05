import {EventEmitter} from 'angular2/core';

export interface Capability {
    getExecutedEvent(): EventEmitter<String[]>;
    updateValues(values: string[]): void;
    getName(): string;
    getHeight(): number;
    getWidth(): number;
}
