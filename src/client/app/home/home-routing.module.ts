import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HomeComponent } from './home.component';
import {InternalLayoutComponent} from '../layout/internal/internal-layout.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: '',
        component: InternalLayoutComponent,
        children: [
          {
            path: '',
            component: HomeComponent
          }
        ]
      }
    ])
  ],
  exports: [RouterModule]
})
export class HomeRoutingModule { }
