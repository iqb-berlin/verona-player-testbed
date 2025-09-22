import { Injectable } from '@angular/core';
import { fromEvent, Observable, Subject } from 'rxjs';

import {
  VopMessage,
  VopReadyNotification,
  VopRuntimeErrorNotification,
  VopStateChangedNotification,
  VopUnitNavigationRequestedNotification,
  VopWindowFocusChangedNotification
} from "../verona.interfaces";

@Injectable({
  providedIn: 'root'
})

export class VeronaSubscriptionService {
  private _vopReadyNotification = new Subject<VopReadyNotification>();
  private _vopStateChangedNotification = new Subject<VopStateChangedNotification>();
  private _vopUnitNavigationRequestedNotification = new Subject<VopUnitNavigationRequestedNotification>();
  private _vopRuntimeErrorNotification = new Subject<VopRuntimeErrorNotification>();
  private _vopWindowFocusChangedNotification = new Subject<VopWindowFocusChangedNotification>();

  resourceURL: string | undefined;

  constructor() {
    fromEvent(window, 'message')
      .subscribe((event: Event): void => this.handleMessage((event as MessageEvent).data as VopMessage));
  }

  private handleMessage(messageData: VopMessage): void {
    switch (messageData.type) {
      case 'vopReadyNotification':
        this._vopReadyNotification.next(messageData);
        break;
      case 'vopStateChangedNotification':
        this._vopStateChangedNotification.next(messageData);
        break;
      case 'vopUnitNavigationRequestedNotification':
        this._vopUnitNavigationRequestedNotification.next(messageData);
        break;
      case 'vopRuntimeErrorNotification':
        this._vopRuntimeErrorNotification.next(messageData);
        break;
      case 'vopWindowFocusChangedNotification':
        this._vopWindowFocusChangedNotification.next(messageData);
        break;
      default:
        console.error(`player: got message of unknown type ${messageData.type}`);
    }
  }

  get vopReadyNotification(): Observable<VopReadyNotification> {
    return this._vopReadyNotification.asObservable();
  }

  get vopStateChangedNotification(): Observable<VopStateChangedNotification> {
    return this._vopStateChangedNotification.asObservable();
  }

  get vopUnitNavigationRequestedNotification(): Observable<VopUnitNavigationRequestedNotification> {
    return this._vopUnitNavigationRequestedNotification.asObservable();
  }

  get vopRuntimeErrorNotification(): Observable<VopRuntimeErrorNotification> {
    return this._vopRuntimeErrorNotification.asObservable();
  }

  get vopWindowFocusChangedNotification(): Observable<VopWindowFocusChangedNotification> {
    return this._vopWindowFocusChangedNotification.asObservable();
  }
}
