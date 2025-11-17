// eslint-disable-next-line max-classes-per-file
import {
  Component, inject, OnDestroy, OnInit
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';

import { VeronaPostService } from '../../../../../verona/src/lib/host/verona-post.service';

import { WidgetService } from '../../services/widget.service';

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
  veronaPostService = inject(VeronaPostService);

  sendWidgetReturn = false;
  private iFrameHostElement: HTMLElement | null = null;
  private iFrameWidget: HTMLIFrameElement | null = null;

  ngOnInit() {
    this.iFrameHostElement = <HTMLElement>document.querySelector('#iFrameWidget');
    this.setupIFrameWidgetPlayer();
  }

  ngOnDestroy() {
    this.iFrameHostElement?.remove();
    this.ws.setWidgetRunning(false);
    if (this.sendWidgetReturn) {
      this.veronaPostService.sendVopWidgetReturn({
        callId: this.ws.callId,
        state: this.ws.state
      });
    }
  }

  continue() {
    this.sendWidgetReturn = true;
  }

  setupIFrameWidgetPlayer(): void {
    if (this.iFrameHostElement) {
      while (this.iFrameHostElement.lastChild) {
        this.iFrameHostElement.removeChild(this.iFrameHostElement.lastChild);
      }
      this.iFrameWidget = <HTMLIFrameElement>document.createElement('iframe');
      this.iFrameWidget.setAttribute('class', 'unitHost');
      const iFrameHeight = this.iFrameWidget.contentWindow?.document?.body?.scrollHeight;
      const iFrameWidth = this.iFrameWidget.contentWindow?.document?.body?.scrollWidth;

      this.iFrameWidget.setAttribute('height', `${String((Math.min((iFrameHeight || 500) - 5), 450))}px`);
      // eslint-disable-next-line no-template-curly-in-string
      this.iFrameWidget.setAttribute('width', `${String((Math.min((iFrameWidth || 350) - 5), 350))}px`);
      this.iFrameHostElement.appendChild(this.iFrameWidget);
      this.iFrameWidget.setAttribute('srcdoc', this.ws.widgetSourceCode);
    }
  }
}
