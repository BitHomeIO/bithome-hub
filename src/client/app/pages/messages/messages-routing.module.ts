import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import {InternalLayoutComponent} from '../../layout/internal/internal-layout.component';
import {MessagesComponent} from './messages.component';

@NgModule({
    imports: [
        RouterModule.forChild([
            {
                path: 'messages',
                component: InternalLayoutComponent,
                children: [
                    {
                        path: '',
                        component: MessagesComponent
                    }
                ]
            }

        ])
    ],
    exports: [RouterModule]
})
export class MessagesRoutingModule {
}
