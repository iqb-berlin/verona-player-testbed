import { Component } from '@angular/core';
import { TestControllerService } from '../test-controller.service';
import {ChunkData} from "../app.classes";

@Component({
  template: `
    <div class="fx-column-start-stretch">
      <h1 mat-dialog-title>
        Anzeige Antworten
      </h1>
      <mat-dialog-content>
        <div *ngFor="let u of tcs.unitList">
          <div class="unit-header">{{u.unitId}}</div>
          <div class="fx-column-start-stretch" *ngFor="let ch of u.getResponsesTransformed()">
            <div class="chunk-header">{{ch.id}}</div>
            <div class="var-data fx-row-start-center" *ngFor="let v of ch.variables">
              <div [style.flex]="'0 0 100px'">{{v.id}}</div>
              <div [style.flex]="'0 0 140px'">{{v.status}}</div>
              <div>{{v.value}}</div>
            </div>
            <div class="raw-data" *ngIf="!ch.variables || ch.variables.length === 0">{{ch.raw}}</div>
          </div>
        </div>
      </mat-dialog-content>
      <mat-dialog-actions>
        <button mat-raised-button [mat-dialog-close]="false">Schließen</button>
        <button mat-button (click)="clearResponses()">Alle Antworten löschen</button>
      </mat-dialog-actions>
    </div>
  `,
  styles: [
    'mat-dialog-content { padding-bottom: 30px;}',
    '.unit-header { font-size: larger; padding: 4px 0 0 4px; background: whitesmoke }',
    '.chunk-header {font-style: italic; margin-left: 10px}',
    '.raw-data {background-color: lightgrey; margin-left: 10px}',
    '.var-data {margin-left: 10px; border: lightgrey solid 1px}',
    '.var-data > div {padding: 6px}',
    '.var-data > div:last-child {overflow: scroll}'
  ]
})
export class ShowResponsesDialogComponent {

  constructor(
    public tcs: TestControllerService
  ) { }

  clearResponses() {
    this.tcs.unitList.forEach(u => u.clearResponses());
  }
}
