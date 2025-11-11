// eslint-disable-next-line max-classes-per-file
import {
  Component, inject, OnDestroy, OnInit
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';

import { WidgetService } from '../../services/widget.service';

@Component({
  selector: 'app-widget',
  templateUrl: './widget.component.html',
  imports: [
    MatIconModule,
    MatDialogModule,
    MatButtonModule
  ],
  styleUrls: ['./widget.component.scss']
})

export class WidgetComponent implements OnInit {
  componentName = 'WidgetComponent';
  readonly dialog = inject(MatDialog);

  ngOnInit() {
    const dialogRef = this.dialog.open(WidgetDialogComponent, { disableClose: true });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      // TODO: send vopWidgetReturn
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

  private iFrameHostElement: HTMLElement | null = null;
  private iFrameWidget: HTMLIFrameElement | null = null;

  ngOnInit() {
    this.iFrameHostElement = <HTMLElement>document.querySelector('#iFrameWidget');
    this.setupIFrameWidgetPlayer();
  }

  ngOnDestroy() {
    this.iFrameHostElement?.remove();
    this.ws.setWidgetRunning(false);
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
}
