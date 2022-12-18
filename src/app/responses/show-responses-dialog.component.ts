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
          <div *ngFor="let ch of u.getResponsesTransformed()">
            <div class="chunk-header" (click)="showRaw(u.unitId, ch.id)">{{ch.id}}</div>
            <ul>
              <li *ngFor="let v of ch.variables">
                {{v.id}} / {{v.value}} / {{v.status}}
              </li>
            </ul>
          </div>
        </div>
      </mat-dialog-content>
      <div class="chunk-raw" (click)="chunkRaw = ''">{{ chunkRaw }}</div>
      <mat-dialog-actions>
        <button mat-raised-button [mat-dialog-close]="false">Schließen</button>
        <button mat-button (click)="clearResponses()">Alle Antworten löschen</button>
      </mat-dialog-actions>
    </div>
  `,
  styles: [
    'mat-dialog-content { padding-bottom: 30px;}',
    '.unit-header { font-size: larger }',
    '.chunk-raw { padding: 10px; font-family: "Lucida Console" }'
  ]
})
export class ShowResponsesDialogComponent {
  chunkRaw = '';
  constructor(
    public tcs: TestControllerService
  ) { }

  clearResponses() {
    this.tcs.unitList.forEach(u => u.clearResponses());
  }

  showRaw(unitId: string, id: string) {
    this.chunkRaw = '';
    const unit = this.tcs.unitList.find(u => u.unitId === unitId);
    if (unit) {
      const chunk = unit.getResponsesTransformed().find(ch => ch.id === id);
      if (chunk) this.chunkRaw = chunk.raw;
    }
  }
}
