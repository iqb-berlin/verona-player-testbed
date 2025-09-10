export type PagingMode = 'separate' | 'concat-scroll' | 'concat-scroll-snap';
export const PagingModeInOrder = ['separate', 'concat-scroll', 'concat-scroll-snap'];

export type LogPolicy = 'disabled' | 'lean' | 'rich' | 'debug';
export const LogPolicyInOrder = ['disabled', 'lean', 'rich', 'debug'];

export interface TaggedString {
  tag: string;
  value: string;
}

export interface TaggedRestorePoint {
  tag: string;
  value: DictionaryStringString;
}

export interface PageData {
  index: number;
  id: string;
  type: '#next' | '#previous' | '#goto';
  disabled: boolean;
}

export interface DictionaryStringString {
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
