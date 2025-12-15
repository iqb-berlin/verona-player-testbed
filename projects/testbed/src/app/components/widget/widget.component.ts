// eslint-disable-next-line max-classes-per-file
import {
  Component, inject, OnDestroy, OnInit
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogContainer, MatDialogModule } from '@angular/material/dialog';

import { SessionService } from 'testbed/src/app/services/session.service';
import { VeronaPostService } from 'verona/src/lib/host/verona-post.service';
import { VeronaSubscriptionService } from 'verona/src/lib/host/verona-subscription.service';

import { WidgetService } from '../../services/widget.service';
import { TestControllerService } from '../../services/test-controller.service';

@Component({
  selector: 'app-widget',
  template: '',
  imports: [
    MatIconModule,
    MatDialogModule,
    MatButtonModule
  ]
})

export class WidgetComponent implements OnInit {
  componentName = 'WidgetComponent';
  readonly dialog = inject(MatDialog);
  veronaPostService = inject(VeronaPostService);

  ngOnInit() {
    const dialogRef = this.dialog.open(WidgetDialogComponent, { disableClose: true });

    dialogRef.afterClosed().subscribe(() => {
      console.log('The widget was closed');
    });
  }
}

@Component({
  selector: 'app-widget-dialog',
  templateUrl: './widget-dialog.component.html',
  imports: [
    MatButtonModule,
    MatDialogModule
  ],
  styleUrls: ['./widget-dialog.component.scss']
})

export class WidgetDialogComponent implements OnInit, OnDestroy {
  componentName = 'WidgetComponent';
  ws = inject(WidgetService);
  tcs = inject(TestControllerService);
  sessionService = inject(SessionService);
  veronaPostService = inject(VeronaPostService);
  veronaSubscriptionService = inject(VeronaSubscriptionService);
  private dialog = inject(MatDialog);
  private container = inject(MatDialogContainer);

  sendWidgetReturn = false;
  private iFrameHostElement: HTMLElement | null = null;
  private iFrameWidget: HTMLIFrameElement | null = null;

  ngOnInit() {
    this.iFrameHostElement = <HTMLElement>document.querySelector('#iFrameWidget');
    this.setupIFrameWidgetPlayer();
    this.veronaSubscriptionService.vowReturnRequested
      .subscribe(vowReturn => {
        console.log('received vowReturnRequested', vowReturn);
        this.continue();
        this.close();
      });
  }

  ngOnDestroy() {
    this.iFrameHostElement?.remove();
    if (this.sendWidgetReturn) {
      this.veronaPostService.sendVopWidgetReturn({
        callId: this.ws.callId,
        state: this.ws.activeWidget?.state || ''
      }, this.sessionService.unitTarget(), this.sessionService.unitSessionId());
    }
    this.ws.setWidgetRunning(false);
  }

  continue() {
    this.sendWidgetReturn = true;
  }

  close() {
    // eslint-disable-next-line no-underscore-dangle
    this.dialog.getDialogById(this.container._config.id ?? '')?.close();
  }

  setupIFrameWidgetPlayer(): void {
    if (this.iFrameHostElement) {
      while (this.iFrameHostElement.lastChild) {
        this.iFrameHostElement.removeChild(this.iFrameHostElement.lastChild);
      }
      this.iFrameWidget = <HTMLIFrameElement>document.createElement('iframe');
      this.iFrameWidget.setAttribute('class', 'unitHost');

      this.iFrameHostElement.appendChild(this.iFrameWidget);
      this.iFrameWidget.setAttribute('srcdoc', this.ws.activeWidget?.sourceCode || '');

      setTimeout(() => {
        const iFrameHeight = this.iFrameWidget?.contentWindow?.document?.body?.scrollHeight;
        const iFrameWidth = this.iFrameWidget?.contentWindow?.document?.body?.scrollWidth;
        if (this.iFrameWidget) {
          this.iFrameWidget.setAttribute('height', `${String(Math.min((iFrameHeight || 500), 450) + 35)}px`);
          this.iFrameWidget.setAttribute('width', `${String(Math.min((iFrameWidth || 350), 350) + 25)}px`);
        }
      }, 50);
    }
  }
}
