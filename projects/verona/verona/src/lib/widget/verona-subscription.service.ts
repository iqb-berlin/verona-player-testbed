import { Injectable } from '@angular/core';
import { fromEvent, Observable, Subject } from 'rxjs';

import {
  VowMessage,
  VowReturnRequest,
  VowStartCommand
} from "../verona.interfaces";

@Injectable({
  providedIn: 'root'
})

export class VeronaSubscriptionService {
  private _vowStartCommand = new Subject<VowStartCommand>();
  private _vowReturnRequest = new Subject<VowReturnRequest>();

  constructor() {
    fromEvent(window, 'message')
      .subscribe((event: Event): void => this.handleMessage((event as MessageEvent).data as VowMessage));
  }

  private handleMessage(messageData: VowMessage): void {
    switch (messageData.type) {
      case 'vowStartCommand':
        this._vowStartCommand.next(messageData);
        break;
      case 'vowReturnRequest':
        this._vowReturnRequest.next(messageData);
        break;
      default:
        console.error(`player: got message of unknown type ${messageData.type}`);
    }
  }

  get vowStartCommand(): Observable<VowStartCommand> {
    return this._vowStartCommand.asObservable();
  }

  get vowReturnRequest(): Observable<VowReturnRequest> {
    return this._vowReturnRequest.asObservable();
  }
}
