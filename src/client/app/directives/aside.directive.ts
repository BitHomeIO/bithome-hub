import { Directive, HostListener } from '@angular/core';

/**
* Allows the aside to be toggled via click.
*/
@Directive({
    selector: '[asideToggle]',
})
export class AsideToggleDirective {
    @HostListener('click', ['$event'])
    toggleOpen($event:any) {
        $event.preventDefault();
        document.querySelector('body').classList.toggle('aside-menu-open');
    }
}
