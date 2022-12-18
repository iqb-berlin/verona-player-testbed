import { Component } from '@angular/core';
import { TestControllerService } from '../test-controller.service';
import { MatDialog } from '@angular/material/dialog';
import { ShowResponsesDialogComponent } from '../responses/show-responses-dialog.component';

@Component({
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})

export class HomeComponent {
  constructor(
    public tcs: TestControllerService,
    private showResponsesDialog: MatDialog
  ) { }

  showResponses() {
    this.showResponsesDialog.open(
      ShowResponsesDialogComponent, { width: '900px' }
    ).afterClosed();
  }
}
