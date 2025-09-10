import { Component, inject } from '@angular/core';

import { TestControllerService } from '../../services/test-controller.service';

@Component({
  templateUrl: './responses.component.html',
  styleUrls: ['./responses.component.scss']
})

export class ResponsesComponent {
  tcs = inject(TestControllerService);
}
