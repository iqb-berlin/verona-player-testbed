import { Injectable } from "@angular/core";

import {
  ModuleDependency, SharedParameter,
  VariableInfo,
  VeronaMetaData,
  VoeMessage
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

  private sendMessage(message: VoeMessage): void {
    this.postTarget.postMessage(message, '*');
  }

  sendVoeDefinitionChangedNotification(values: {
    unitDefinition?: string,
    variables?: VariableInfo[],
    dependeciesToPlay?: ModuleDependency[],
    dependeciesToEdit?: ModuleDependency[],
    sharedParameters?: SharedParameter[]
  }): void {
    this.sendMessage({
      type: 'voeDefinitionChangedNotification',
      sessionId: this.sessionID as string,
      timeStamp: Date.now().toString(),
      ...(values)
    });
  }

  sendReadyNotification(playerMetadata: VeronaMetaData): void {
    this.sendMessage({
      type: 'voeReadyNotification',
      metadata: playerMetadata
    });
  }
}
