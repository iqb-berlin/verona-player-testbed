import { Component, input } from '@angular/core';

@Component({
  selector: 'app-status-badge',
  template: `
    <div [style.background-color]="statusColors[value()]">
      {{header()}}: {{value() || '?'}}
    </div>
  `,
  styles: [
    `div {
      padding: 2px 10px;
      margin: 0 5px;
      font-size: 13px;
      min-width: 100px;
    }`
  ]
})

export class StatusComponent {
  header = input.required<string>();
  value = input.required<string>();
  statusColors: { [ key: string ]: string } = {
    yes: 'LimeGreen',
    complete: 'LimeGreen',
    all: 'LimeGreen',
    player: 'LimeGreen',
    no: 'Yellow',
    some: 'Yellow',
    host: 'Yellow',
    none: 'Red',
    outside: 'Red',
    'complete-and-valid': 'LawnGreen',
    '': 'DarkGray'
  };
}
