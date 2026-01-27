// eslint-disable-next-line max-classes-per-file
import {
  AfterViewInit, Component, inject, TemplateRef, ViewChild, ViewContainerRef
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogClose } from '@angular/material/dialog';
import { Overlay, OverlayModule, OverlayRef } from '@angular/cdk/overlay';
import { CdkPortal, PortalModule, TemplatePortal } from '@angular/cdk/portal';

import { VeronaPostService } from 'verona/src/lib/host/verona-post.service';
import { VeronaSubscriptionService } from 'verona/src/lib/host/verona-subscription.service';

import { SessionService } from '../../services/session.service';
import { WidgetService } from '../../services/widget.service';
import { TestControllerService } from '../../services/test-controller.service';

@Component({
  selector: 'app-widget',
  templateUrl: './widget-overlay.component.html',
  styleUrls: ['./widget-overlay.component.scss'],
  imports: [
    PortalModule,
    OverlayModule,
    MatIconModule,
    MatButtonModule,
    MatDialogClose
  ]
})

export class WidgetOverlayComponent implements AfterViewInit {
  componentName = 'WidgetComponent';
  private overlay = inject(Overlay);
  private viewContainerRef = inject(ViewContainerRef);
  private overlayRef: OverlayRef | undefined;
  templatePortal!: TemplatePortal;

  sessionService = inject(SessionService);
  veronaPostService = inject(VeronaPostService);
  veronaSubscriptionService = inject(VeronaSubscriptionService);
  ws = inject(WidgetService);
  tcs = inject(TestControllerService);

  @ViewChild('portalContent') widgetOverlayPortal!: TemplateRef<CdkPortal>;
  sendWidgetReturn = false;
  private iFrameHostElement: HTMLElement | null = null;
  private iFrameWidget: HTMLIFrameElement | null = null;

  ngAfterViewInit() {
    this.overlayRef = this.overlay.create({
      positionStrategy: this.overlay.position().global().centerHorizontally().centerVertically(),
      hasBackdrop: true,
      backdropClass: 'cdk-overlay-dark-backdrop',
      panelClass: 'widget-overlay-panel'
    });
    this.templatePortal = new TemplatePortal(this.widgetOverlayPortal, this.viewContainerRef);
    this.overlayRef.attach(this.templatePortal);

    this.iFrameHostElement = <HTMLElement>document.querySelector('#iFrameWidget');
    this.setupIFrameWidgetPlayer();
    this.veronaSubscriptionService.vowReturnRequested
      .subscribe(vowReturn => {
        console.log('received vowReturnRequested', vowReturn);
        this.continue();
        this.close();
      });
  }

  continue() {
    this.sendWidgetReturn = true;
  }

  close() {
    if (this.overlayRef) this.overlayRef.dispose();
    this.iFrameHostElement?.remove();
    if (this.sendWidgetReturn) {
      this.veronaPostService.sendVopWidgetReturn({
        callId: this.ws.callId,
        state: this.ws.activeWidget?.state || ''
      }, this.sessionService.unitTarget(), this.sessionService.unitSessionId());
    }
    this.ws.setWidgetRunning(false);
  }

  setupIFrameWidgetPlayer(): void {
    if (this.iFrameHostElement) {
      while (this.iFrameHostElement.lastChild) {
        this.iFrameHostElement.removeChild(this.iFrameHostElement.lastChild);
      }
      this.iFrameWidget = <HTMLIFrameElement>document.createElement('iframe');
      this.iFrameWidget.setAttribute('class', 'unitHost');
      this.iFrameWidget.setAttribute('height', '100%');
      this.iFrameWidget.setAttribute('width', '100%');

      this.iFrameHostElement.appendChild(this.iFrameWidget);
      this.iFrameWidget.setAttribute('srcdoc', this.ws.activeWidget?.sourceCode || '');
    }
  }
}
