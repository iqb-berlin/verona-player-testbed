import { Injectable } from '@angular/core';

import {
  VeronaMetaData,
  VowMessage
} from '../verona.interfaces';

@Injectable({
  providedIn: 'root'
})

export class VeronaPostService {
  sessionID: string | undefined;
  private postTarget: Window = window.parent;

  setPostTarget(postTarget: Window): void {
    this.postTarget = postTarget;
  }

  private sendMessage(message: VowMessage): void {
    this.postTarget.postMessage(message, '*');
  }

  sendVowStateChangedNotification(values: {
    state?: string,
    sharedParameters?: Record<string, string>
  }): void {
    this.sendMessage({
      type: 'vowStateChangedNotification',
      sessionId: this.sessionID as string,
      timeStamp: Date.now().toString(),
      ...(values)
    });
  }

  sendVowReadyNotification(playerMetadata: VeronaMetaData): void {
    this.sendMessage({
      type: 'vowReadyNotification',
      metadata: playerMetadata
    });
  }

  sendVowReturnRequested(saveState?: boolean): void {
    this.sendMessage({
      type: "vowReturnRequested",
      sessionId: this.sessionID as string,
      timeStamp: Date.now().toString(),
      saveState: saveState || true
    });
  }
}
