import { Component, inject } from '@angular/core';

import { TestControllerService } from '../../services/test-controller.service';

@Component({
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})

export class SettingsComponent {
  tcs = inject(TestControllerService);
}
