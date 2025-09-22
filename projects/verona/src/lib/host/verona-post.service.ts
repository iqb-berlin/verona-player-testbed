import { Injectable } from "@angular/core";

import {
  UnitState,
  PlayerState,
  LogEntry,
  VopStartCommand,
  VopMessage,
  PlayerConfig
} from "../verona.interfaces";

@Injectable({
  providedIn: 'root'
})

export class VeronaPostService {
  sessionID: string | undefined;
  postTarget: Window = window.parent;

  setPostTarget(postTarget: Window): void {
    this.postTarget = postTarget;
  }

  private sendMessage(message: VopMessage): void {
    this.postTarget.postMessage(message, '*');
  }

  sendVopStartCommand(values: {
    unitState?: UnitState,
    playerState?: PlayerState,
    log?: LogEntry[]
  }): void {
    this.sendMessage(this.createVopStartCommand(values));
  }

  private createVopStartCommand(values: {
    unitDefinition?: string;
    unitDefinitionType?: string;
    unitState?: UnitState;
    playerConfig?: PlayerConfig;
  }): VopStartCommand {
    return {
      type: 'vopStartCommand',
      sessionId: this.sessionID as string,
      ...(values)
    };
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
      reason: reason ? reason : undefined
    });
  }
}
