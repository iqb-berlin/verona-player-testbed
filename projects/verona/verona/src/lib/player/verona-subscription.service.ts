import { Injectable } from '@angular/core';
import { fromEvent, Observable, Subject } from 'rxjs';

import {
  VopMessage,
  VopNavigationDeniedNotification,
  VopPageNavigationCommand,
  VopPlayerConfigChangedNotification,
  VopStartCommand,
  VopWidgetReturn
} from "../verona.interfaces";

@Injectable({
  providedIn: 'root'
})

export class VeronaSubscriptionService {
  private _vopStartCommand = new Subject<VopStartCommand>();
  private _vopNavigationDeniedNotification = new Subject<VopNavigationDeniedNotification>();
  private _vopPageNavigationCommand = new Subject<VopPageNavigationCommand>();
  private _vopPlayerConfigChangedNotification = new Subject<VopPlayerConfigChangedNotification>();
  private _vopWidgetReturn = new Subject<VopWidgetReturn>();

  resourceURL: string | undefined;

  constructor() {
    fromEvent(window, 'message')
      .subscribe((event: Event): void => this.handleMessage((event as MessageEvent).data as VopMessage));
  }

  private handleMessage(messageData: VopMessage): void {
    switch (messageData.type) {
      case 'vopStartCommand':
        this._vopStartCommand.next(messageData);
        break;
      case 'vopPlayerConfigChangedNotification':
        this._vopPlayerConfigChangedNotification.next(messageData);
        break;
      case 'vopNavigationDeniedNotification':
        this._vopNavigationDeniedNotification.next(messageData);
        break;
      case 'vopPageNavigationCommand':
        this._vopPageNavigationCommand.next(messageData);
        break;
      case 'vopWidgetReturn':
        this._vopWidgetReturn.next(messageData);
        break;
      default:
        console.error(`player: got message of unknown type ${messageData.type}`);
    }
  }

  get vopStartCommand(): Observable<VopStartCommand> {
    return this._vopStartCommand.asObservable();
  }

  get vopPlayerConfigChangedNotification(): Observable<VopPlayerConfigChangedNotification> {
    return this._vopPlayerConfigChangedNotification.asObservable();
  }

  get vopNavigationDeniedNotification(): Observable<VopNavigationDeniedNotification> {
    return this._vopNavigationDeniedNotification.asObservable();
  }

  get vopPageNavigationCommand(): Observable<VopPageNavigationCommand> {
    return this._vopPageNavigationCommand.asObservable();
  }

  get vopWidgetReturn(): Observable<VopWidgetReturn> {
    return this._vopWidgetReturn.asObservable();
  }
}
