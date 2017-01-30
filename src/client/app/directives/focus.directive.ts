import {Directive, Input, ElementRef, OnChanges, HostListener} from '@angular/core';

@Directive({
    selector: '[focus]'
})
export class FocusDirective implements OnChanges {
    @Input('focus') focus: boolean;

    constructor(private elementRef: ElementRef) {
    }

    @HostListener('focus') onFocus() {
        this.focus = true;
    }

    @HostListener('blur') onBlur() {
        this.focus = false;
    }

    ngOnChanges(changes: any) {
        if (changes.focus && changes.focus.currentValue === true) {
            this.elementRef.nativeElement.focus();
        }
    }
}
