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

  // eslint-disable-next-line class-methods-use-this
  private sendMessage(message: VeronaMessage, postTarget: Window): void {
    postTarget.postMessage(message, '*');
  }

  sendVopStartCommand(values: {
    unitState?: UnitState,
    playerState?: PlayerState,
    log?: LogEntry[]
  }, postTarget?: Window, sessionId?: string): void {
    this.sendMessage({
      type: 'vopStartCommand',
      sessionId: sessionId || this.sessionID as string,
      ...(values)
    }, postTarget || this.postTarget);
  }

  sendVopPageNavigationCommand(target: string, postTarget?: Window, sessionId?: string): void {
    this.sendMessage({
      type: 'vopPageNavigationCommand',
      sessionId: sessionId || this.sessionID as string,
      target: target
    }, postTarget || this.postTarget);
  }

  sendVopPlayerConfigChangedNotification(playerConfig: PlayerConfig, postTarget?: Window, sessionId?: string): void {
    this.sendMessage({
      type: 'vopPlayerConfigChangedNotification',
      sessionId: sessionId || this.sessionID as string,
      playerConfig: playerConfig
    }, postTarget || this.postTarget);
  }

  sendVopNavigationDeniedNotification(reason?: ['presentationIncomplete' | 'responsesIncomplete'],
                                      postTarget?: Window, sessionId?: string) {
    this.sendMessage({
      type: 'vopNavigationDeniedNotification',
      sessionId: sessionId || this.sessionID as string,
      reason: reason || undefined
    }, postTarget || this.postTarget);
  }

  sendVopWidgetReturn(values: {
    callId?: string;
    state?: string;
  }, postTarget?: Window, sessionId?: string): void {
    this.sendMessage({
      type: 'vopWidgetReturn',
      sessionId: sessionId || this.sessionID as string,
      ...(values)
    }, postTarget || this.postTarget);
  }

  sendVowStartCommand(values: {
    parameters?: WidgetParameter[];
    sharedParameters?: SharedParameter[];
    state?: string;
  }, postTarget?: Window, sessionId?: string): void {
    this.sendMessage({
      type: 'vowStartCommand',
      sessionId: sessionId || this.sessionID as string,
      ...(values)
    }, postTarget || this.postTarget);
  }
}
