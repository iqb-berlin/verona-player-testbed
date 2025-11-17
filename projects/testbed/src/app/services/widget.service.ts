import { inject, Injectable, signal } from '@angular/core';
import { BroadcastService } from './broadcast.service';
import { VeronaMetadata } from '../models/verona-metadata.class';

@Injectable({
  providedIn: 'root'
})

export class WidgetService {
  widgetSourceCode = '';
  broadcastService = inject(BroadcastService);
  componentName = 'WidgetService';

  parameters: Record<string, string> = {};
  callId = '';
  state = '';

  private _widgetMeta = signal<VeronaMetadata | undefined>(undefined);
  widgetMeta = this._widgetMeta.asReadonly();
  private _widgetRunning = signal(false);
  widgetRunning = this._widgetRunning.asReadonly();

  setWidgetMeta(v: VeronaMetadata) {
    this._widgetMeta.set(v);
  }

  setWidgetRunning(v: boolean) {
    this._widgetRunning.set(v);
  }

  uploadWidgetFile(fileInputEvent: Event): void {
    const target = fileInputEvent.target as HTMLInputElement;
    if (target && target.files && target.files.length > 0) {
      const fileToUpload = target.files[0];
      const myReader = new FileReader();
      myReader.onload = e => {
        this.widgetSourceCode = e.target ? (e.target.result as string) : '';
        this.setWidgetMeta(new VeronaMetadata(fileToUpload.name, this.widgetSourceCode));
      };
      myReader.readAsText(fileToUpload);
    }
  }
}
