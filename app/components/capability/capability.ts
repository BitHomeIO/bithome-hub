import {EventEmitter} from 'angular2/core';
import {Output} from 'angular2/core';

export interface Capability {
    getExecutedEvent(): EventEmitter<String[]>;
}
