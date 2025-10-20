import { Injectable } from "@angular/core";

import {
  UnitState,
  PlayerState,
  LogEntry,
  VeronaMetaData,
  VopMessage,
  VopError,
  NavigationTarget
} from "../verona.interfaces";

@Injectable({
  providedIn: 'root'
})

export class VeronaPostService {
  sessionID: string | undefined;
  private postTarget: Window = window.parent;

  setPostTarget(postTarget: Window): void {
    this.postTarget = postTarget;
  }

  private sendMessage(message: VopMessage): void {
    this.postTarget.postMessage(message, '*');
  }

  sendVopStateChangedNotification(values: {
    unitState?: UnitState,
    playerState?: PlayerState,
    log?: LogEntry[]
  }): void {
    this.sendMessage({
      type: 'vopStateChangedNotification',
      sessionId: this.sessionID as string,
      timeStamp: Date.now(),
      ...(values)
    });
  }

  sendVopReadyNotification(playerMetadata: VeronaMetaData): void {
    this.sendMessage({
      type: 'vopReadyNotification',
      metadata: playerMetadata
    });
  }

  sendVopRuntimeErrorNotification(error: VopError): void {
    this.sendMessage({
      type: 'vopRuntimeErrorNotification',
      sessionId: this.sessionID as string,
      code: error.code,
      message: error.message
    });
  }

  sendVopUnitNavigationRequestedNotification(target: NavigationTarget): void {
    this.sendMessage({
      type: 'vopUnitNavigationRequestedNotification',
      sessionId: this.sessionID as string,
      target: target
    });
  }

  sendVopWindowFocusChangedNotification(focused: boolean): void {
    this.sendMessage({
      type: 'vopWindowFocusChangedNotification',
      timeStamp: Date.now().toString(),
      hasFocus: focused
    });
  }

  sendVopWidgetReturn(values: {
    callId?: string;
    state?: string;
    parameters?: Record<string, unknown>;
    widgetType: string;
  }): void {
    this.sendMessage({
      type: 'vopWidgetReturn',
      sessionId: this.sessionID as string,
      ...(values)
    })
  }
}
