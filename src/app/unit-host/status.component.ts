import {Component, Input} from '@angular/core';

@Component({
  selector: 'app-status-badge',
  template: `
    <div [style.background-color]="statusColors[value]">
      {{header}}: {{value || '?'}}
    </div>
  `,
  styles: [
    `div {
      padding: 2px 10px;
      margin: 0 5px;
      font-size: 13px;
      width: 140px;
    }`
  ]
})

export class StatusComponent {
  @Input() header!: string;
  @Input() value!: string;
  public statusColors: {[ key: string ]: string} = {
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
  }
}
