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
        <div *ngFor="let u of allKeys">
          <div class="unit-header">{{u}}</div>
          <div class="fx-column-start-stretch" *ngFor="let ch of allResponses[u]">
            <div class="chunk-header">{{ch.id}}</div>
            <div class="var-data fx-row-stretch-center-gap" *ngFor="let v of ch.variables">
              <div [style.flex]="'0 0 100px'">{{v.id}}</div>
              <div [style.flex]="'0 0 140px'">{{v.status}}</div>
              <div *ngIf="hasSubForms" [style.flex]="'0 0 100px'">{{v.subform}}</div>
              <div>{{v.value}}</div>
            </div>
            <div class="raw-data" *ngIf="ch.variables.length === 0">{{ch.raw}}</div>
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
        '.unit-header { font-size: larger; padding: 4px 0 0 4px; background: #cfc9d5; }',
        '.chunk-header {font-style: italic; margin-left: 10px}',
        '.raw-data {background-color: lightgrey; margin-left: 10px}',
        '.var-data {margin-left: 10px; border: lightgrey solid 1px}',
        '.var-data > div:last-child {overflow: hidden auto; max-height: 85px}'
    ],
    standalone: false
})
export class ShowResponsesDialogComponent {
  allResponses: { [key: string]: ChunkData[] };
  hasSubForms = false;

  get allKeys(): string[] {
    return Object.keys(this.allResponses);
  }
  constructor(
    public tcs: TestControllerService
  ) {
    this.allResponses = {};
    this.tcs.unitList.forEach(u => {
      this.allResponses[u.unitId] = u.getResponsesTransformed();
      if (!this.hasSubForms) {
        const chunkHavingSubform = this.allResponses[u.unitId].find(chunk => {
          const firstSubFormResponse = chunk.variables.find(v => !!v.subform);
          return firstSubFormResponse ? chunk : null;
        });
        this.hasSubForms = !!chunkHavingSubform;
      }
    })
    console.log(this.allResponses);
  }

  clearResponses() {
    this.tcs.unitList.forEach(u => u.clearResponses());
    this.allResponses = {};
  }
}
