import { Observable, Subject } from 'rxjs';
import { filter } from 'rxjs/operators';
import { Injectable } from '@angular/core';

import { UnitState } from '../../../projects/verona/src/lib/verona.interfaces';

interface BroadcastMessage {
  type: string;
  unitNumber?: number;
  unitId?: string;
  payload?: UnitState;
  unitSequenceId?: number;
  timeStamp?: string;
}

@Injectable({
  providedIn: 'root'
})

export class BroadcastService {
  private broadcastChannel: BroadcastChannel;
  private onMessage = new Subject<any>();

  constructor() {
    this.broadcastChannel = new BroadcastChannel('testbed-responses');
    this.broadcastChannel.onmessage = message => this.onMessage.next(message.data);
  }

  publish(message: BroadcastMessage): void {
    this.broadcastChannel.postMessage(message);
  }

  messagesOfType(type: string): Observable<BroadcastMessage> {
    return this.onMessage.pipe(
      filter(message => message.type === type)
    );
  }
}
