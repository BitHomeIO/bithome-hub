import {CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';
import {SideBarComponent} from './sidebar.component';
import {NgModule} from '@angular/core';

@NgModule({
	imports: [CommonModule, RouterModule],
	declarations: [SideBarComponent],
	exports: [SideBarComponent]
})

export class SideBarModule { }
