import { Component } from '@angular/core';
import {
  MatDialogActions, MatDialogClose, MatDialogContent, MatDialogTitle
} from '@angular/material/dialog';
import { MatButton } from '@angular/material/button';

import { TestControllerService } from '../../services/test-controller.service';
import { ChunkData } from '../../models/app.classes';
import { ResponseTableComponent } from './response-table.component';

@Component({
  template: `
    <div class="fx-column-start-stretch">
      <h1 mat-dialog-title>
        Anzeige Antworten
      </h1>
      <mat-dialog-content>
        <response-table [allResponses]="allResponses"></response-table>
      </mat-dialog-content>
      <mat-dialog-actions>
        <button mat-raised-button [mat-dialog-close]="false">Schließen</button>
        <button mat-button (click)="clearResponses()">Alle Antworten löschen</button>
      </mat-dialog-actions>
    </div>
  `,
  imports: [
    MatDialogActions,
    MatDialogClose,
    MatDialogContent,
    MatDialogTitle,
    MatButton,
    ResponseTableComponent
  ],
  styles: [
    'mat-dialog-content { padding-bottom: 30px;}',
    '.unit-header { font-size: larger; padding: 4px 0 0 4px; background: #cfc9d5; }',
    '.chunk-header {font-style: italic; margin-left: 10px}',
    '.raw-data {background-color: lightgrey; margin-left: 10px}',
    '.var-data {margin-left: 10px; border: lightgrey solid 1px}',
    '.var-data > div:last-child {overflow: hidden auto; max-height: 85px}'
  ]
})

export class ShowResponsesDialogComponent {
  allResponses: { [key: string]: ChunkData[] };

  get allKeys(): string[] {
    return Object.keys(this.allResponses);
  }

  constructor(
    public tcs: TestControllerService
  ) {
    this.allResponses = this.tcs.getAllResponses();
  }

  clearResponses() {
    this.tcs.clearResponses();
    this.allResponses = {};
  }
}
