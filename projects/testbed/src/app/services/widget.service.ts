import { inject, Injectable, signal } from '@angular/core';

import { WidgetParameter, WidgetType } from 'verona/src/lib/verona.interfaces';

import { BroadcastService } from './broadcast.service';
import { VeronaMetadata } from '../models/verona-metadata.class';
import { WidgetData } from '../models/app.classes';

@Injectable({
  providedIn: 'root'
})

export class WidgetService {
  componentName = 'WidgetService';
  broadcastService = inject(BroadcastService);

  activeWidget: WidgetData | undefined;
  parameters: WidgetParameter[] = [];
  callId = '';
  state = '';

  private _widgetList = signal<WidgetData[]>([]);
  widgetList = this._widgetList.asReadonly();
  private _widgetRunning = signal(false);
  widgetRunning = this._widgetRunning.asReadonly();

  setWidgetRunning(v: boolean) {
    this._widgetRunning.set(v);
  }

  clearResponses() {
    this._widgetList().forEach((w: WidgetData) => {
      w.state = '';
    });
    this.state = '';
  }

  clearWidgetList() {
    this._widgetList.set([]);
    this.state = '';
  }

  setActiveWidget(type?: WidgetType) {
    if (type === undefined) {
      this.activeWidget = this._widgetList()[0];
      return this.activeWidget;
    }
    const widget = this._widgetList().find(w => w.widgetType === type);
    if (widget) {
      this.activeWidget = widget;
      return this.activeWidget;
    }
    return undefined;
  }

  uploadWidgetFile(fileInputEvent: Event): void {
    const target = fileInputEvent.target as HTMLInputElement;
    if (target && target.files && target.files.length > 0) {
      const fileToUpload = target.files[0];
      const myReader = new FileReader();
      myReader.onload = e => {
        const widgetSourceCode = e.target ? (e.target.result as string) : '';
        const meta = new VeronaMetadata(fileToUpload.name, widgetSourceCode);
        // create new widget from uploaded file
        const newWidget = new WidgetData(meta.id, {
          widgetType: meta.type,
          sourceCode: widgetSourceCode,
          metaData: meta
        });
        // check if widget with same type already exists
        const widget = this._widgetList().find(w => w.widgetType === meta.type);
        if (widget) {
          const index = this._widgetList().indexOf(widget);
          this._widgetList.update(w => {
            w[index] = newWidget;
            return w;
          });
        } else {
          this._widgetList.update(w => [...w, newWidget]);
        }
      };
      myReader.readAsText(fileToUpload);
    }
  }
}
