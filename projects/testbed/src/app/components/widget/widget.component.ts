import {
  Component, inject, input, OnInit
} from '@angular/core';
import { MatIconButton } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { TestControllerService } from '../../services/test-controller.service';

@Component({
  selector: 'app-widget',
  templateUrl: './widget.component.html',
  imports: [
    MatIconModule,
    MatIconButton
  ],
  styleUrls: ['./widget.component.scss']
})
export class WidgetComponent implements OnInit {
  widgetSourceCode = input<string>('');
  tcs = inject(TestControllerService);

  private iFrameHostElement: HTMLElement | null = null;
  private iFrameWidget: HTMLIFrameElement | null = null;

  ngOnInit() {
    this.iFrameHostElement = <HTMLElement>document.querySelector('#iFrameWidget');

    this.setupIFrameItemPlayer();
  }

  setupIFrameItemPlayer(): void {
    if (this.iFrameHostElement) {
      while (this.iFrameHostElement.lastChild) {
        this.iFrameHostElement.removeChild(this.iFrameHostElement.lastChild);
      }
      this.iFrameWidget = <HTMLIFrameElement>document.createElement('iframe');
      this.iFrameWidget.setAttribute('class', 'unitHost');
      this.iFrameWidget.setAttribute('height', `${String((Math.min(this.iFrameWidget.scrollHeight - 5), 680))}px`);
      // eslint-disable-next-line no-template-curly-in-string
      this.iFrameWidget.setAttribute('width', `${String((Math.min(this.iFrameWidget.scrollWidth - 5), 1200))}px`);
      this.iFrameHostElement.appendChild(this.iFrameWidget);
      this.iFrameWidget.setAttribute('srcdoc', this.widgetSourceCode());
    }
  }

  closeWidget() {
    this.iFrameHostElement?.remove();
    this.tcs.setWidgetRunning(false);
  }
}
