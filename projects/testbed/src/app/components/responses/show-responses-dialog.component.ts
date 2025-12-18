import { Component, inject, OnInit } from '@angular/core';
import {
  MatDialogActions, MatDialogClose, MatDialogContent, MatDialogTitle
} from '@angular/material/dialog';
import { MatButton } from '@angular/material/button';

import { TestControllerService } from '../../services/test-controller.service';
import { BroadcastService } from '../../services/broadcast.service';
import { WidgetService } from '../../services/widget.service';
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
        <!--@if (ws.state) {
          <div class="responses-row">
            <h3>Widget Responses:</h3>
            <div class="var-data-header fx-row-stretch-center-gap">
              <div [style.flex]="'0 0 200px'">Id</div>
              <div [style.flex]="'0 0 150px'">Type</div>
              <div [style.flex]="'0 0 100px'">State</div>
              <div [style.flex]="'0 0 200px'">Parameters</div>
            </div>
            <div class="var-data fx-row-stretch-center-gap">
              <div [style.flex]="'0 0 200px'">{{ ws.widgetMeta()?.id }}</div>
              <div [style.flex]="'0 0 150px'">{{ ws.widgetMeta()?.type }}</div>
              <div [style.flex]="'0 0 100px'">{{ ws.state }}</div>
              <div [style.flex]="'0 0 200px'">{{ ws.parameters || '' }}</div>
            </div>
          </div>
        }-->
        @if (tcs.sharedParameters.length > 0) {
          <div class="responses-row">
            <h3>Shared Parameters:</h3>
            @for (
              p of tcs.sharedParameters; track $index) {
              {{ p.key }}: {{ p.value }}
            }
          </div>
        }
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

export class ShowResponsesDialogComponent implements OnInit {
  allResponses: { [key: string]: ChunkData[] } = {};

  ws = inject(WidgetService);
  tcs = inject(TestControllerService);
  broadcastService = inject(BroadcastService);

  get allKeys(): string[] {
    return Object.keys(this.allResponses);
  }

  ngOnInit() {
    this.allResponses = this.tcs.getAllResponses();
  }

  clearResponses() {
    this.tcs.clearResponses();
    this.ws.clearResponses();
    this.allResponses = {};
    this.broadcastService.publish({
      type: 'clearResponses'
    });
  }
}
