import { Component, effect, input } from '@angular/core';

import { ChunkData } from '../../models/app.classes';

@Component({
  selector: 'response-table',
  template: `
    @for (u of allKeys; track $index) {
      <div class="unit-wrapper">
        <div class="unit-header">{{ u }}</div>
        @for (ch of allResponses()[u]; track $index)
        {
          <div class="fx-column-start-stretch data-chunk">
            <div class="chunk-header">{{ ch.id }}</div>
            @if (ch.variables && ch.variables.length) {
                <div class="var-data-header fx-row-stretch-center-gap">
                  <div [style.flex]="'0 0 100px'">Id</div>
                  <div [style.flex]="'0 0 200px'">Status</div>
                  <div [style.flex]="'0 0 100px'">Subform</div>
                  <div [style.flex]="'0 0 50px'">Code</div>
                  <div [style.flex]="'0 0 50px'">Score</div>
                <div>Value</div>
              </div>
              @for (v of ch.variables; track $index) {
                <div class="var-data fx-row-stretch-center-gap">
                  <div [style.flex]="'0 0 100px'">{{ v.id }}</div>
                  <div [style.flex]="'0 0 200px'">{{ v.status }}</div>
                  <div [style.flex]="'0 0 100px'">{{ v.subform || '' }}</div>
                  <div [style.flex]="'0 0 50px'">{{ v.code || '' }}</div>
                  <div [style.flex]="'0 0 50px'">{{ v.score || '' }}</div>
                  <div>{{ v.value }}</div>
                </div>
              }
            } @else if (ch.raw) {
              <div class="var-data-header fx-row-stretch-center-gap">
                <div>Raw Data</div>
              </div>
              <div class="raw-data">{{ ch.raw }}</div>
            }
          </div>
        }
      </div>
    }
  `,
  styles: [
    'mat-dialog-content{ padding-bottom: 30px;}',
    '.unit-header {font-size: larger; padding: 4px 0 0 4px; background: #cfc9d5;}',
    '.chunk-header {font-style: italic; margin-left: 10px}',
    '.raw-data {background-color: lightgrey; margin-left: 10px}',
    '.var-data {margin: 0 10px; border-top: lightgrey solid 1px;}',
    '.var-data-header {margin-left: 10px; font-weight: bolder}',
    '.var-data > div:last-child {overflow: hidden auto; max-height: 85px}',
    '.data-chunk {margin: 8px; background-color: #eee}',
    '.unit-wrapper {margin-bottom: 16px; border: lightgrey solid 1px}',
  ]
})

export class ResponseTableComponent {
  allResponses = input<{ [key: string]: ChunkData[] }>({});
  hasSubForms = input(false);
  allKeys: string[] = [];

  constructor() {
    effect(() => {
      this.allKeys = Object.keys(this.allResponses());
    });
  }
}
