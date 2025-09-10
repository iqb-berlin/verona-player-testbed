import {Component, inject} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSelectModule } from '@angular/material/select';

import { LogPolicyInOrder, PagingModeInOrder } from '../../interfaces/test-controller.interfaces';
import { ShowResponsesDialogComponent } from '../responses/show-responses-dialog.component';
import { TestControllerService } from '../../services/test-controller.service';

@Component({
  templateUrl: './home.component.html',
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
  styleUrls: ['./home.component.scss']
})

export class HomeComponent {
  tcs = inject(TestControllerService);

  constructor(
    private showResponsesDialog: MatDialog
  ) { }

  showResponses() {
    this.showResponsesDialog.open(
      ShowResponsesDialogComponent, { width: '900px' }
    ).afterClosed();
  }

  protected readonly LogPolicyInOrder = LogPolicyInOrder;
  protected readonly PagingModeInOrder = PagingModeInOrder;
}
