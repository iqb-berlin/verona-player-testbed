import { Injectable } from '@angular/core';
import { fromEvent, Observable, Subject } from 'rxjs';

import {
  VeronaMessage,
  VopMessage,
  VopReadyNotification,
  VopRuntimeErrorNotification,
  VopStateChangedNotification,
  VopUnitNavigationRequestedNotification,
  VopWidgetCall,
  VopWindowFocusChangedNotification,
  VowReadyNotification, VowReturnRequest,
  VowStateChangedNotification
} from '../verona.interfaces';

@Injectable({
  providedIn: 'root'
})

export class VeronaSubscriptionService {
  private _vopReadyNotification = new Subject<VopReadyNotification>();
  private _vopStateChangedNotification = new Subject<VopStateChangedNotification>();
  private _vopUnitNavigationRequestedNotification = new Subject<VopUnitNavigationRequestedNotification>();
  private _vopRuntimeErrorNotification = new Subject<VopRuntimeErrorNotification>();
  private _vopWindowFocusChangedNotification = new Subject<VopWindowFocusChangedNotification>();
  private _vopWidgetCall = new Subject<VopWidgetCall>();
  private _vowReadyNotification = new Subject<VowReadyNotification>();
  private _vowReturnRequest = new Subject<VowReturnRequest>();
  private _vowStateChangedNotification = new Subject<VowStateChangedNotification>();

  resourceURL: string | undefined;

  constructor() {
    fromEvent(window, 'message')
      .subscribe((event: Event): void => this.handleMessage((event as MessageEvent).data as VopMessage));
  }

  private handleMessage(messageData: VeronaMessage): void {
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
      case 'vopWidgetCall':
        this._vopWidgetCall.next(messageData);
        break;
      case 'vowReadyNotification':
        this._vowReadyNotification.next(messageData);
        break;
      case 'vowStateChangedNotification':
        this._vowStateChangedNotification.next(messageData);
        break;
      case 'vowReturnRequest':
        this._vowReturnRequest.next(messageData);
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

  get vopWidgetCall(): Observable<VopWidgetCall> {
    return this._vopWidgetCall.asObservable();
  }

  get vowReadyNotification(): Observable<VowReadyNotification> {
    return this._vowReadyNotification.asObservable();
  }

  get vowStateChangedNotification(): Observable<VowStateChangedNotification> {
    return this._vowStateChangedNotification.asObservable();
  }
}
