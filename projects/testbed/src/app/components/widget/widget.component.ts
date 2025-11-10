import {
  Component, inject, OnInit
} from '@angular/core';
import { MatIconButton } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { VeronaSubscriptionService } from '../../../../../verona/src/lib/host/verona-subscription.service';
import { VeronaPostService } from '../../../../../verona/src/lib/host/verona-post.service';

import { WidgetService } from '../../services/widget.service';
import { LogService } from '../../services/log.service';

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
  componentName = 'ResponsesComponent';
  ws = inject(WidgetService);
  veronaSubscriptionService = inject(VeronaSubscriptionService);
  veronaPostService = inject(VeronaPostService);

  private widgetPlayerSessionId = '';

  private iFrameHostElement: HTMLElement | null = null;
  private iFrameWidget: HTMLIFrameElement | null = null;

  ngOnInit() {
    this.iFrameHostElement = <HTMLElement>document.querySelector('#iFrameWidget');

    this.setupIFrameWidgetPlayer();

    this.veronaSubscriptionService.vowReadyNotification
      .subscribe(msg => {
        LogService.info(this.componentName, 'got vowReadyNotification');
        LogService.debug(this.componentName, 'msgData: ', msg);
        if (!msg.metadata) {
          LogService.warn(this.componentName, ' > player metadata missing');
        }
        this.widgetPlayerSessionId = WidgetComponent.getNewSessionId();
        this.veronaPostService.sessionID = this.widgetPlayerSessionId;
        this.veronaPostService.sendVowStartCommand({});
      });
  }

  setupIFrameWidgetPlayer(): void {
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
      this.iFrameWidget.setAttribute('srcdoc', this.ws.widgetSourceCode);
    }
  }

  closeWidget() {
    this.iFrameHostElement?.remove();
    this.ws.setWidgetRunning(false);
  }

  private static getNewSessionId(): string {
    return Math.floor(Math.random() * 20000000 + 10000000).toString();
  }
}
