import { Injectable } from '@angular/core';
import { fromEvent, Observable, Subject } from 'rxjs';

import {
  VowMessage,
  VowStartCommand
} from "../verona.interfaces";

@Injectable({
  providedIn: 'root'
})

export class VeronaSubscriptionService {
  private _vowStartCommand = new Subject<VowStartCommand>();

  constructor() {
    fromEvent(window, 'message')
      .subscribe((event: Event): void => this.handleMessage((event as MessageEvent).data as VowMessage));
  }

  private handleMessage(messageData: VowMessage): void {
    switch (messageData.type) {
      case 'vowStartCommand':
        this._vowStartCommand.next(messageData);
        break;
      default:
        console.error(`player: got message of unknown type ${messageData.type}`);
    }
  }

  get vowStartCommand(): Observable<VowStartCommand> {
    return this._vowStartCommand.asObservable();
  }
}
