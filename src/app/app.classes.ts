import { KeyValuePairString } from './test-controller.interfaces';

export enum UnitNavigationTarget {
  NEXT = '#next',
  ERROR = '#error',
  PREVIOUS = '#previous',
  FIRST = '#first',
  LAST = '#last',
  END = '#end',
  MENU = '#menu',
  PAUSE = '#pause'
}
export class UnitData {
  sequenceId: number;
  filename: string;
  playerId: string;
  isCurrent: boolean;
  definition: string; // actual code of the unit
  restorePoint: KeyValuePairString;
  presentationCompleteState: string;

  constructor(fileName: string, sequId: number) {
    this.filename = fileName;
    this.sequenceId = sequId;
    this.playerId = '';
    this.isCurrent = false;
    this.definition = '';
    this.restorePoint = {};
    this.presentationCompleteState = '';
  }

  public loadDefinition(fileObject): void {
    const myReader = new FileReader();
    myReader.onload = (e) => {
      this.definition = e.target.result as string;
      console.log(`loaded ${this.filename} - ${this.definition.length.toString()}`);
    };
    myReader.readAsText(fileObject);
  }
}
export enum VeronaInterfacePlayerVersion {
  v1x,
  v2_0
}
