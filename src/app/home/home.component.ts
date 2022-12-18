import { Component } from '@angular/core';
import { TestControllerService } from '../test-controller.service';

@Component({
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})

export class HomeComponent {
  constructor(public tcs: TestControllerService) { }
}
