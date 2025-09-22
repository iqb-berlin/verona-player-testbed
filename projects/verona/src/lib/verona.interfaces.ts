export type NavigationTarget = 'first' | 'last' | 'previous' | 'next' | 'end';
export type Progress = 'none' | 'some' | 'complete';
export type PrintMode = 'off' | 'on' | 'on-with-ids';
export type PagingMode = 'separate' | 'buttons' | 'concat-scroll' | 'concat-scroll-snap';
export type LogPolicy = 'disabled' | 'lean' | 'rich' | 'debug';

export const UnitStateDataType = 'iqb-standard@1.1';

export interface PlayerConfig {
  unitNumber?: number;
  unitTitle?: string;
  unitId?: string;
  pagingMode?: PagingMode;
  printMode?: PrintMode;
  logPolicy?: LogPolicy;
  startPage?: string;
  enabledNavigationTargets?: NavigationTarget[];
  directDownloadUrl?: string;
}

export interface UnitState {
  dataParts?: Record<string, string>;
  presentationProgress?: Progress;
  responseProgress?: Progress;
  unitStateDataType?: string;
}

export interface PlayerState {
  validPages?: ValidPage[];
  currentPage?: string;
}

export interface ValidPage {
  id: string;
  label?: string;
}

export interface LogEntry {
  timeStamp: string,
  key: string,
  content?: string
}

export interface VopError {
  code: string;
  message: string;
}

export interface VopStartCommand {
  type: 'vopStartCommand';
  sessionId: string;
  unitDefinition?: string;
  unitDefinitionType?: string;
  unitState?: UnitState;
  playerConfig?: PlayerConfig;
}

export interface VopRuntimeErrorNotification {
  type: 'vopRuntimeErrorNotification';
  sessionId: string;
  code: string;
  message?: string;
}

export interface VopNavigationDeniedNotification {
  type: 'vopNavigationDeniedNotification';
  sessionId: string;
  reason?: ['presentationIncomplete' | 'responsesIncomplete']
}

export interface VopPlayerConfigChangedNotification {
  type: 'vopPlayerConfigChangedNotification'
  sessionId: string;
  playerConfig: PlayerConfig;
}

export interface VopPageNavigationCommand {
  type: 'vopPageNavigationCommand';
  sessionId: string;
  target: string;
}

export interface VopReadyNotification {
  type: 'vopReadyNotification';
  metadata: VopMetaData;
}

export interface VopMetaData {
  $schema: string,
  id: string;
  type: string;
  version: string;
  specVersion: string;
  metadataVersion: string
  name: {
    lang: string;
    value: string;
  }[];
  description: {
    lang: string;
    value: string;
  }[];
  maintainer: {
    name: Record<string, string>[];
    email: string;
    url: string;
  }
  code: {
    repositoryType: string;
    licenseType: string;
    licenseUrl: string;
    repositoryUrl: string;
  }
  notSupportedFeatures: string[];
}

export interface VopStateChangedNotification {
  type: 'vopStateChangedNotification';
  sessionId: string;
  timeStamp: number;
  unitState?: UnitState;
  playerState?: PlayerState;
  log?: LogEntry[];
}

export interface VopUnitNavigationRequestedNotification {
  type: 'vopUnitNavigationRequestedNotification';
  sessionId: string;
  target: NavigationTarget;
}

export interface VopWindowFocusChangedNotification {
  type: 'vopWindowFocusChangedNotification';
  timeStamp: number;
  hasFocus: boolean;
}

export type VopMessage =
  VopStartCommand |
  VopPlayerConfigChangedNotification |
  VopRuntimeErrorNotification |
  VopNavigationDeniedNotification |
  VopPageNavigationCommand |
  VopReadyNotification |
  VopStateChangedNotification |
  VopWindowFocusChangedNotification |
  VopUnitNavigationRequestedNotification;
