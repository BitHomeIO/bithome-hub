import {Component} from '@angular/core';
import './operators';
import {UnderscoreCase, DeserializeKeysFrom, SerializeKeysTo} from 'cerialize';

@Component({
  selector: 'body',
  template: '<router-outlet></router-outlet>'
})

export class AppComponent {
  constructor() {
    DeserializeKeysFrom(UnderscoreCase);
    SerializeKeysTo(UnderscoreCase);
  }
}
