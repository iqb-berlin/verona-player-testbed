import {Subject} from 'rxjs';
import {ElementRef, Injectable} from '@angular/core';
import {LogEntryKey, UnitNaviButtonData, UnitNavigationTarget, UploadFileType} from './test-controller.interfaces';
import {Router} from "@angular/router";

@Injectable({
  providedIn: 'root'
})
export class TestControllerService {
  public fileSelectElement: ElementRef;
  private _currentUnitSequenceId: number;
  public currentUnitTitle = '';
  public unitPrevEnabled = false;
  public unitNextEnabled = false;
  public unitList: UnitNaviButtonData[] = [];
  private uploadFileType: UploadFileType

  public get currentUnitSequenceId(): number {
    return this._currentUnitSequenceId;
  }
  public set currentUnitSequenceId(v: number) {
    this.unitPrevEnabled = this.unitList.length > 0 && v > 0;
    this.unitNextEnabled = v < (this.unitList.length - 1);
    for (let sequ = 0; sequ < this.unitList.length ; sequ++) {
      this.unitList[sequ].isCurrent = sequ === v;
    }
    this._currentUnitSequenceId = v;
  }

  private players: {[filename: string]: string} = {};
  public postMessage$ = new Subject<MessageEvent>();

  constructor (
    private router: Router
  ) {
  }

  // 7777777777777777777777777777777777777777777777777777777777777777777777
  public resetDataStore() {
    this.players = {};
    this.currentUnitSequenceId = 0;
    this.currentUnitTitle = '';
    this.unitPrevEnabled = false;
    this.unitNextEnabled = false;
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
  public getUnitByName(shortLabel: string): UnitNaviButtonData {
    let myFoundUnit: UnitNaviButtonData = null;
    for (let sequ = 0; sequ < this.unitList.length ; sequ++) {
      if (this.unitList[sequ].shortLabel === shortLabel) {
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
    console.log('UNIT RESPONSES: unit' + unitKey + ' - "' + response + '"');
  }
  public newUnitRestorePoint(unitKey: string, unitSequenceId: number, restorePoint: string, postToServer: boolean) {
    this.unitList[unitSequenceId].restorePoint = restorePoint;
    console.log('UNIT RESTORE_POINT: unit' + unitKey + ' - "' + restorePoint + '"');
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
          this.router.navigateByUrl('/r');
          break;
      }
    }
  }

  setUploadFileRequest(uploadFileType: UploadFileType) {
    this.uploadFileType = uploadFileType;
    this.fileSelectElement.nativeElement.click();
  }

  fileUploaded(fileInputEvent: any) {
    let myReader = new FileReader();
    switch (this.uploadFileType) {
      case UploadFileType.UNIT:
        myReader.onload = (e) => {
          let myFoundUnit: UnitNaviButtonData = this.getUnitByName(fileInputEvent.target.files[0].name);
          if (myFoundUnit) {
            myFoundUnit.definition = e.target.result as string;
            this.currentUnitSequenceId = myFoundUnit.sequenceId;
            this.router.navigateByUrl(`/u/${this.currentUnitSequenceId}`);
          } else {
            this.unitList.push({
              sequenceId: this.unitList.length,
              shortLabel: fileInputEvent.target.files[0].name,
              longLabel: fileInputEvent.target.files[0].name,
              playerId: '',
              isCurrent: false,
              definition:  e.target.result as string,
              restorePoint: '',
              presentationCompleteState: ''
            });
            this.setUnitNavigationRequest(UnitNavigationTarget.LAST);
          }
        }
        myReader.readAsText(fileInputEvent.target.files[0]);

        break;
      case UploadFileType.PLAYER:
        myReader.onload = (e) => {
          if (Object.keys(this.players).length > 0) {
            this.players = {};
          }
          this.players[fileInputEvent.target.files[0].name] = e.target.result as string;
          console.log(this.players);
        }
        myReader.readAsText(fileInputEvent.target.files[0]);
        break;
    }
  }
}
