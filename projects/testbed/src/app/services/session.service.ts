import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})

export class SessionService {
  componentName = 'SessionService';

  private _widgetSessionId = signal('');
  widgetSessionId = this._widgetSessionId.asReadonly();
  private _unitSessionId = signal('');
  unitSessionId = this._unitSessionId.asReadonly();
  private _unitTarget = signal(window.parent);
  unitTarget = this._unitTarget.asReadonly();
  private _widgetTarget = signal(window.parent);
  widgetTarget = this._widgetTarget.asReadonly();

  setWidgetSessionId(sessionId: string) {
    this._widgetSessionId.set(sessionId);
  }

  setUnitSessionId(sessionId: string) {
    this._unitSessionId.set(sessionId);
  }

  setWidgetTarget(target: Window): void {
    this._widgetTarget.set(target);
  }

  setUnitTarget(target: Window) {
    this._unitTarget.set(target);
  }
}
