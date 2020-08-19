import {Subject} from 'rxjs';
import {ElementRef, Injectable} from '@angular/core';
import {
  KeyValuePairString,
  LogEntryKey,
  StatusVisual,
  UnitNavigationTarget,
  UploadFileType
} from './test-controller.interfaces';
import {Router} from "@angular/router";
import {UnitData, VeronaInterfacePlayerVersion} from "./app.classes";

@Injectable({
  providedIn: 'root'
})
export class TestControllerService {
  public fileSelectElement: ElementRef;
  private _currentUnitSequenceId: number;
  public currentUnitTitle = '';
  public unitList: UnitData[] = [];
  private uploadFileType: UploadFileType;
  public statusVisual: StatusVisual[] = [
    {id: 'presentation', label: 'P', color: 'Teal', description: 'Status: Vollständigkeit der Präsentation'},
    {id: 'responses', label: 'R', color: 'Teal', description: 'Status: Vollständigkeit der Antworten'}
  ];
  public get currentUnitSequenceId(): number {
    return this._currentUnitSequenceId;
  }
  public set currentUnitSequenceId(v: number) {
    for (let sequ = 0; sequ < this.unitList.length ; sequ++) {
      this.unitList[sequ].isCurrent = sequ === v;
    }
    this._currentUnitSequenceId = v;
  }

  public players: {[filename: string]: string} = {};
  public postMessage$ = new Subject<MessageEvent>();
  public veronaInterfacePlayerVersion = VeronaInterfacePlayerVersion.v2_0;

  constructor (
    private router: Router
  ) {

  }

  // 7777777777777777777777777777777777777777777777777777777777777777777777
  public resetDataStore() {
    this.players = {};
    this.currentUnitSequenceId = 0;
    this.currentUnitTitle = '';
  }

  // 7777777777777777777777777777777777777777777777777777777777777777777777
  // uppercase and add extension if not part
  public normaliseId(s: string, standardext = ''): string {
    s = s.trim().toUpperCase();
    s.replace(/\s/g, '_');
    if (standardext.length > 0) {
      standardext = standardext.trim().toUpperCase();
      standardext.replace(/\s/g, '_');
      standardext = '.' + standardext.replace('.', '');

      if (s.slice(-(standardext.length)) !== standardext) {
        s = s + standardext;
      }
    }
    return s;
  }

  // 7777777777777777777777777777777777777777777777777777777777777777777777
  public addPlayer (id: string, player: string) {
    this.players[this.normaliseId(id, 'html')] = player;
  }
  public hasPlayer (id: string): boolean {
    return this.players.hasOwnProperty(this.normaliseId(id, 'html'));
  }
  public getPlayer(id: string): string {
    if (id) {
      return this.players[this.normaliseId(id, 'html')];
    } else {
      const firstPlayerId = Object.keys(this.players)[0];
      return this.players[firstPlayerId];
    }
  }
  public getUnitByName(filename: string): UnitData {
    let myFoundUnit: UnitData = null;
    for (let sequ = 0; sequ < this.unitList.length ; sequ++) {
      if (this.unitList[sequ].filename === filename) {
        myFoundUnit = this.unitList[sequ];
        break;
      }
    }
    return myFoundUnit
  }

  public addUnitLog(unitKey: string, logKey: LogEntryKey, entry = '') {
    console.log('UNIT LOG: unit' + unitKey + ' - logKey ' + logKey + (entry.length > 0 ?  ' - entry "' + JSON.stringify(entry) + '"' : ''));
  }
  public newUnitResponse(unitKey: string, response: string, responseType: string) {
    console.log('UNIT RESPONSES: unit' + unitKey + ' - "' + response + '", type: "' + responseType + '"');
  }
  public newUnitRestorePoint(unitKey: string, unitSequenceId: number, restorePoint: KeyValuePairString) {
    this.unitList[unitSequenceId].restorePoint = restorePoint;
    console.log('UNIT RESTORE_POINT: unit' + unitKey + ' ---' + JSON.stringify(restorePoint) + '---');
  }
  public newUnitStatePresentationComplete(unitKey: string, unitSequenceId: number, presentationComplete: string) {
    this.unitList[unitSequenceId].presentationCompleteState = presentationComplete;
    console.log('UNIT PRESENTATION_COMPLETE: unit' + unitKey + ' - "' + presentationComplete + '"');
  }
  public newUnitStateResponsesGiven(unitDbKey: string, unitSequenceId: number, responsesGiven: string) {
    this.addUnitLog(unitDbKey, LogEntryKey.RESPONSESCOMPLETE, responsesGiven);
  }

  public setUnitNavigationRequest(navString: string = UnitNavigationTarget.NEXT) {
    if (this.unitList.length === 0) {
      this.router.navigateByUrl('/r');
    } else {
      switch (navString) {
        case UnitNavigationTarget.MENU:
        case UnitNavigationTarget.ERROR:
        case UnitNavigationTarget.PAUSE:
        case UnitNavigationTarget.END:
          this.router.navigateByUrl('/r');
          break;
        case UnitNavigationTarget.NEXT:
          if (this.currentUnitSequenceId < this.unitList.length - 1) {
            this.router.navigateByUrl(`/u/${this.currentUnitSequenceId + 1}`);
          }
          break;
        case UnitNavigationTarget.PREVIOUS:
          if (this.currentUnitSequenceId > 0 && this.unitList.length > 0) {
            this.router.navigateByUrl(`/u/${this.currentUnitSequenceId - 1}`);
          }
          break;
        case UnitNavigationTarget.FIRST:
          if (this.unitList.length > 0) {
            this.router.navigateByUrl('/u/0');
          }
          break;
        case UnitNavigationTarget.LAST:
          if (this.unitList.length > 0) {
            this.router.navigateByUrl(`/u/${this.unitList.length - 1}`);
          }
          break;

        default:
          this.router.navigateByUrl(`/u/${navString}`);
          break;
      }
    }
  }

  setUploadFileRequest(uploadFileType: UploadFileType) {
    this.uploadFileType = uploadFileType;
    (this.fileSelectElement.nativeElement as HTMLInputElement).accept = uploadFileType === UploadFileType.PLAYER ? '.html' : '.voud';
    (this.fileSelectElement.nativeElement as HTMLInputElement).multiple = uploadFileType === UploadFileType.UNIT;
    this.fileSelectElement.nativeElement.click();
  }

  fileUploaded(fileInputEvent: any) {
    // TODO async/feedback/show progress
    // TODO bug: uploadFileType might be changed before upload finished
    switch (this.uploadFileType) {
      case UploadFileType.UNIT:
        for (let sequ = 0; sequ < fileInputEvent.target.files.length ; sequ++) {
          let myUnit = this.getUnitByName(fileInputEvent.target.files[sequ].name);
          if (myUnit) {
            myUnit.loadDefinition(fileInputEvent.target.files[sequ]);
          } else {
            myUnit = new UnitData(fileInputEvent.target.files[sequ].name, this.unitList.length);
            this.unitList.push(myUnit);
            myUnit.loadDefinition(fileInputEvent.target.files[sequ]);
          }
        }
        break;
      case UploadFileType.PLAYER:
        let myReader = new FileReader();
        myReader.onload = (e) => {
          if (Object.keys(this.players).length > 0) {
            this.players = {};
          }
          this.players[fileInputEvent.target.files[0].name] = e.target.result as string;
        };
        myReader.readAsText(fileInputEvent.target.files[0]);
        break;
    }
  }

  emptyUnitList() {
    this.unitList = [];
  }

  setPresentationStatus(status: string) { // 'yes' | 'no' | '' | undefined;
    if (status === 'yes') {
      this.changeStatusColor('presentation', 'LimeGreen');
    } else if (status === 'no') {
      this.changeStatusColor('presentation', 'LightCoral');
    } else if (status === '') {
      this.changeStatusColor('presentation', 'DarkGray');
    }
    // if undefined: no change
  }

  setResponsesStatus(status: string) { // 'yes' | 'no' | 'all' | '' | undefined
    if (status === 'yes') {
      this.changeStatusColor('responses', 'Gold');
    } else if (status === 'no') {
      this.changeStatusColor('responses', 'LightCoral');
    } else if (status === 'all') {
      this.changeStatusColor('responses', 'LimeGreen');
    } else if (status === '') {
      this.changeStatusColor('responses', 'DarkGray');
    }
    // if undefined: no change
  }

  changeStatusColor(id: string, newcolor: string) {
    for (let i = 0; i < this.statusVisual.length; i++) {
      if (this.statusVisual[i].id === id) {
        if (this.statusVisual[i].color !== newcolor) {
          this.statusVisual[i].color = newcolor;
          break;
        }
      }
    }
  }
}
