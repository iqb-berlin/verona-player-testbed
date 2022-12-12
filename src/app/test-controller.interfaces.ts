// used everywhere
export interface TaggedString {
  tag: string;
  value: string;
}

export interface TaggedRestorePoint {
  tag: string;
  value: KeyValuePairString;
}

export enum LogEntryKey {
  UNITENTER = 'UNITENTER',
  UNITTRYLEAVE = 'UNITTRYLEAVE',
  BOOKLETLOADSTART = 'BOOKLETLOADSTART',
  BOOKLETLOADCOMPLETE = 'BOOKLETLOADCOMPLETE',
  PAGENAVIGATIONSTART = 'PAGENAVIGATIONSTART',
  PAGENAVIGATIONCOMPLETE = 'PAGENAVIGATIONCOMPLETE',
  PRESENTATIONCOMPLETE = 'PRESENTATIONCOMPLETE',
  RESPONSESCOMPLETE = 'RESPONSESCOMPLETE'
}

export interface PageData {
  index: number;
  id: string;
  type: '#next' | '#previous' | '#goto';
  disabled: boolean;
}

export interface KeyValuePairString {
  [K: string]: string;
}

export enum UnitNavigationTarget {
  NEXT = 'next',
  ERROR = 'error',
  PREVIOUS = 'previous',
  FIRST = 'first',
  LAST = 'last',
  END = 'end',
  MENU = 'menu',
  PAUSE = 'pause'
}

export const EnabledNavigationTargetsConfig: UnitNavigationTarget[] = [
  UnitNavigationTarget.NEXT,
  UnitNavigationTarget.PREVIOUS,
  UnitNavigationTarget.FIRST,
  UnitNavigationTarget.LAST,
  UnitNavigationTarget.END
];

export enum UploadFileType {
  PLAYER,
  UNIT
}

export interface StatusVisual {
  label: string;
  color: string;
  description: string;
}

export enum WindowFocusState {
  PLAYER = 'player',
  HOST = 'host',
  UNKNOWN = 'outside'
}
