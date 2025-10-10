import { Component, inject } from '@angular/core';

import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';

import { TestControllerService } from '../../services/test-controller.service';
import {
  ForcePresentationCompleteInOrder,
  ForceResponseCompleteInOrder,
  LogPolicyInOrder,
  NavigationTargetsInOder,
  PagingModeInOrder
} from '../../interfaces/test-controller.interfaces';
import { LogLevelByOrder, LogService } from '../../services/log.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  imports: [
    MatIconModule,
    MatButtonModule,
    MatTooltipModule,
    MatFormFieldModule,
    MatInputModule,
    MatCheckboxModule,
    MatSelectModule,
    FormsModule
  ],
  standalone: true,
  styleUrls: ['./settings.component.scss']
})

export class SettingsComponent {
  tcs = inject(TestControllerService);
  logService = inject(LogService);

  protected readonly LogPolicyInOrder = LogPolicyInOrder;
  protected readonly PagingModeInOrder = PagingModeInOrder;
  protected readonly NavigationTargetsInOder = NavigationTargetsInOder;
  protected readonly ForcePresentationCompleteInOrder = ForcePresentationCompleteInOrder;
  protected readonly ForceResponseCompleteInOrder = ForceResponseCompleteInOrder;

  restartPlayer() {
    this.tcs.restartPlayer();
  }

  applyConfigChanges() {
    this.tcs.applyConfigChanges();
  }

  protected readonly LogService = LogService;
  protected readonly LogLevelByOrder = LogLevelByOrder;
}
