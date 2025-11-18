import { Injectable } from '@angular/core';

import {
  UnitState,
  PlayerState,
  LogEntry,
  PlayerConfig,
  VeronaMessage,
  SharedParameter,
  WidgetParameter
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

  private sendMessage(message: VeronaMessage): void {
    this.postTarget.postMessage(message, '*');
  }

  sendVopStartCommand(values: {
    unitState?: UnitState,
    playerState?: PlayerState,
    log?: LogEntry[]
  }): void {
    this.sendMessage({
      type: 'vopStartCommand',
      sessionId: this.sessionID as string,
      ...(values)
    });
  }

  sendVopPageNavigationCommand(target: string): void {
    this.sendMessage({
      type: 'vopPageNavigationCommand',
      sessionId: this.sessionID as string,
      target: target
    });
  }

  sendVopPlayerConfigChangedNotification(playerConfig: PlayerConfig): void {
    this.sendMessage({
      type: 'vopPlayerConfigChangedNotification',
      sessionId: this.sessionID as string,
      playerConfig: playerConfig
    });
  }

  sendVopNavigationDeniedNotification(reason?: ['presentationIncomplete' | 'responsesIncomplete']) {
    this.sendMessage({
      type: 'vopNavigationDeniedNotification',
      sessionId: this.sessionID as string,
      reason: reason || undefined
    });
  }

  sendVopWidgetReturn(values: {
    callId?: string;
    state?: string;
  }): void {
    this.sendMessage({
      type: 'vopWidgetReturn',
      sessionId: this.sessionID as string,
      ...(values)
    });
  }

  sendVowStartCommand(values: {
    parameters?: WidgetParameter[];
    sharedParameters?: SharedParameter[];
    state?: string;
  }): void {
    this.sendMessage({
      type: 'vowStartCommand',
      sessionId: this.sessionID as string,
      ...(values)
    });
  }
}
