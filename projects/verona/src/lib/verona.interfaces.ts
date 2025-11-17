export type NavigationTarget = 'first' | 'last' | 'previous' | 'next' | 'end';
export type Progress = 'none' | 'some' | 'complete';
export type PrintMode = 'off' | 'on' | 'on-with-ids';
export type PagingMode = 'separate' | 'buttons' | 'concat-scroll' | 'concat-scroll-snap';
export type LogPolicy = 'disabled' | 'lean' | 'rich' | 'debug';
export type DependencyType = 'FILE' | 'WIDGET' | 'SERVICE';
export type ModuleType = 'EDITOR' | 'PLAYER' | 'SCHEMER' | 'WIDGET_CALC' | 'WIDGET_PERIODIC_TABLE' | 'WIDGET_MOLECULE_EDITOR';
export type WidgetType = 'WIDGET_CALC' | 'WIDGET_PERIODIC_TABLE' | 'WIDGET_MOLECULE_EDITOR';

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

export interface EditorConfig {
  directDownloadUrl?: string;
  role?: string;
  sharedParameters?: Record<string, string>;
}

export interface ModuleDependency {
  id: string;
  description?: string;
  type: DependencyType;
  required?: boolean;
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

export interface VeronaMetaData {
  $schema: string,
  id: string;
  type: ModuleType;
  version: string;
  specVersion: string;
  metadataVersion: string
  name: {
    lang: string;
    value: string;
  }[];
  description?: {
    lang: string;
    value: string;
  }[];
  dependencies?: ModuleDependency[];
  maintainer?: {
    name?: {
      lang: string;
      value: string;
    }[];
    email?: string;
    url?: string;
  }
  code?: {
    repositoryType?: string;
    licenseType?: string;
    licenseUrl?: string;
    repositoryUrl?: string;
  }
  notSupportedFeatures?: string[];
}

export interface VariableInfo {
  $schema: string;
  id: string;
  alias?: string;
  type: string;
  format?: string;
  multiple?: boolean;
  nullable?: boolean;
  values?: {
    value: string | number | boolean;
    label?: string;
  }[];
  valuePositionLabels?: string[];
  valuesComplete?: boolean;
  page?: string;
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
  metadata: VeronaMetaData;
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
  timeStamp: string;
  hasFocus: boolean;
}

export interface VopWidgetCall {
  type: 'vopWidgetCall';
  sessionId: string;
  callId?: string;
  widgetType: WidgetType;
  parameters?: Record<string, string>;
  state?: string;
}

export interface VopWidgetReturn {
  type: 'vopWidgetReturn';
  sessionId: string;
  callId?: string;
  state?: string;
}

export interface VoeReadyNotification {
  type: 'voeReadyNotification';
  metadata: VeronaMetaData;
}

export interface VoeDefinitionChangedNotification {
  type: 'voeDefinitionChangedNotification';
  sessionId: string;
  timeStamp: string;
  unitDefinition?: string;
  unitDefinitionType?: string;
  variables?: VariableInfo[];
  dependenciesToPlay?: ModuleDependency[];
  dependenciesToEdit?: ModuleDependency[];
  sharedParameters?: Record<string, string>;
}

export interface VoeStartCommand {
  type: 'voeStartCommand';
  sessionId: string;
  unitDefinition?: string;
  unitDefinitionType?: string;
  editorConfig?: EditorConfig;
}

export interface VowReadyNotification {
  type: 'vowReadyNotification';
  metadata: VeronaMetaData;
}

export interface VowStartCommand {
  type: 'vowStartCommand';
  sessionId: string;
  parameters?: Record<string, string>;
  sharedParameters?: Record<string, string>;
  state?: string;
}

export interface VowStateChangedNotification {
  type: 'vowStateChangedNotification';
  sessionId: string;
  timeStamp: string;
  sharedParameters?: Record<string, string>;
  state?: string;
}

export interface VowReturnRequested {
  type: 'vowReturnRequested';
  sessionId: string;
  timeStamp: string;
  saveState?: boolean;
}

export type VoeMessage =
  VoeReadyNotification |
  VoeStartCommand |
  VoeDefinitionChangedNotification;

export type VopMessage =
  VopStartCommand |
  VopPlayerConfigChangedNotification |
  VopRuntimeErrorNotification |
  VopNavigationDeniedNotification |
  VopPageNavigationCommand |
  VopReadyNotification |
  VopStateChangedNotification |
  VopWindowFocusChangedNotification |
  VopUnitNavigationRequestedNotification |
  VopWidgetCall |
  VopWidgetReturn;

export type VowMessage =
  VowReadyNotification |
  VowStateChangedNotification |
  VowStartCommand |
  VowReturnRequested;

export type VeronaMessage =
  VowMessage |
  VopMessage |
  VoeMessage;
