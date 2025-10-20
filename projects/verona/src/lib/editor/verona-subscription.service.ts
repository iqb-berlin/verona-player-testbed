import { Injectable } from '@angular/core';
import { fromEvent, Observable, Subject } from 'rxjs';

import {
  VoeStartCommand,
  VoeMessage,
} from "../verona.interfaces";

@Injectable({
  providedIn: 'root'
})

export class VeronaSubscriptionService {
  private _voeStartCommand = new Subject<VoeStartCommand>();

  resourceURL: string | undefined;

  constructor() {
    fromEvent(window, 'message')
      .subscribe((event: Event): void => this.handleMessage((event as MessageEvent).data as VoeMessage));
  }

  private handleMessage(messageData: VoeMessage): void {
    switch (messageData.type) {
      case 'voeStartCommand':
        this._voeStartCommand.next(messageData);
        break;
      default:
        console.error(`player: got message of unknown type ${messageData.type}`);
    }
  }

  get voeStartCommand(): Observable<VoeStartCommand> {
    return this._voeStartCommand.asObservable();
  }
}
