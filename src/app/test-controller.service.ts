import { ElementRef, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import {
  KeyValuePairString,
  LogEntryKey,
  StatusVisual,
  UnitNavigationTarget,
  UploadFileType,
  WindowFocusState
} from './test-controller.interfaces';
import { UnitData, VeronaInterfacePlayerVersion } from './app.classes';

@Injectable({
  providedIn: 'root'
})
export class TestControllerService {
  public fileSelectElement: ElementRef;
  private _currentUnitSequenceId: number;
  public currentUnitTitle = '';
  public suppressPlayerConsoleMessages = true;
  public unitList: UnitData[] = [];
  private uploadFileType: UploadFileType;

  public status: { [name: string]: StatusVisual } = {
    presentation: {
      label: 'P',
      color: 'Teal',
      description: 'Status der Präsentation unbekannt'
    },
    responses: {
      label: 'A',
      color: 'Teal',
      description: 'Status der Beantwortung unbekannt'
    },
    focus: {
      label: 'F',
      color: 'Teal',
      description: 'Fokus'
    }
  };

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
  public windowFocusState$ = new Subject<WindowFocusState>();
  public veronaInterfacePlayerVersion = VeronaInterfacePlayerVersion.v2_0;

  constructor(
    private router: Router
  ) {
    this.windowFocusState$.pipe(
      debounceTime(500)
    ).subscribe((newState: WindowFocusState) => {
      switch (newState) {
        case WindowFocusState.HOST:
          this.changeStatus('focus', 'Yellow', 'Host hat den Fokus');
          break;
        case WindowFocusState.PLAYER:
          this.changeStatus('focus', 'LimeGreen', 'Player hat den Fokus');
          break;
        case WindowFocusState.UNKNOWN:
          this.changeStatus('focus', 'Red', 'Fokus verloren');
          break;
        // no default
      }
    });
  }

  public resetDataStore(): void {
    this.players = {};
    this.currentUnitSequenceId = 0;
    this.currentUnitTitle = '';
  }

  // uppercase and add extension if not part
  public static normaliseId(id: string, standardext: string): string {
    let normalisedId = id.trim().toLowerCase();
    normalisedId.replace(/\s/g, '_');
    if (standardext !== undefined) {
      let fileExtension = standardext.trim().toLowerCase();
      fileExtension.replace(/\s/g, '_');
      fileExtension = `.${fileExtension.replace('.', '')}`;

      if (normalisedId.slice(-(fileExtension.length)) !== fileExtension) {
        normalisedId += fileExtension;
      }
    }
    return normalisedId;
  }

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
    for (let sequ = 0; sequ < this.unitList.length; sequ++) {
      if (this.unitList[sequ].filename === filename) {
        myFoundUnit = this.unitList[sequ];
        break;
      }
    }
    return myFoundUnit;
  }

  public addUnitLog(unitKey: string, logKey: LogEntryKey, entry = '') {
    console.log('UNIT LOG: unit' + unitKey + ' - logKey ' + logKey + (entry.length > 0 ?  ' - entry "' + JSON.stringify(entry) + '"' : ''));
  }

  public static newUnitResponse(unitKey: string, response: string, responseType: string): void {
    const responseStr = JSON.stringify(response);
    console.log(`UNIT RESPONSES: unit${unitKey} - "${responseStr.substr(0, Math.min(40, response.length))}", type: "${responseType}"`);
  }

  public newUnitRestorePoint(unitKey: string,
                             unitSequenceId: number,
                             restorePoint: KeyValuePairString): void {
    this.unitList[unitSequenceId].restorePoint = restorePoint;
    const restorePointStr = JSON.stringify(restorePoint);
    console.log(`UNIT RESTORE_POINT: unit${unitKey} ---${restorePointStr.substr(0, Math.min(40, restorePointStr.length))}---`);
  }

  public newUnitStatePresentationComplete(unitKey: string,
                                          unitSequenceId: number,
                                          presentationComplete: string): void {
    this.unitList[unitSequenceId].presentationCompleteState = presentationComplete;
    console.log(`UNIT PRESENTATION_COMPLETE: unit${unitKey} - "${presentationComplete}"`);
  }

  public static newUnitStateResponsesGiven(unitDbKey: string,
                                           unitSequenceId: number,
                                           responsesGiven: string): void {
    TestControllerService.addUnitLog(unitDbKey, LogEntryKey.RESPONSESCOMPLETE, responsesGiven);
  }

  public setUnitNavigationRequest(navString: string = UnitNavigationTarget.NEXT): void {
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

  setUploadFileRequest(uploadFileType: UploadFileType): void {
    this.uploadFileType = uploadFileType;
    (this.fileSelectElement.nativeElement as HTMLInputElement).accept =
      uploadFileType === UploadFileType.PLAYER ? '.html' : '.voud';
    (this.fileSelectElement.nativeElement as HTMLInputElement).multiple =
      uploadFileType === UploadFileType.UNIT;
    this.fileSelectElement.nativeElement.click();
  }

  fileUploaded(fileInputEvent: any): void {
    // TODO async/feedback/show progress
    // TODO bug: uploadFileType might be changed before upload finished
    switch (this.uploadFileType) {
      case UploadFileType.UNIT:
        for (let sequ = 0; sequ < fileInputEvent.target.files.length; sequ++) {
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
      case UploadFileType.PLAYER: {
        const myReader = new FileReader();
        myReader.onload = (e) => {
          if (Object.keys(this.players).length > 0) {
            this.players = {};
          }
          this.players[fileInputEvent.target.files[0].name] = e.target.result as string;
        };
        myReader.readAsText(fileInputEvent.target.files[0]);
        break;
      }
      // no default
    }
  }

  emptyUnitList(): void {
    this.unitList = [];
  }

  setPresentationStatus(status: string): void {
    switch (status) {
      case 'yes':
      case 'complete':
        this.changeStatus('presentation', 'LimeGreen', 'Präsentation vollständig');
        break;
      case 'no':
      case 'some':
        this.changeStatus('presentation', 'Yellow', 'Präsentation unvollständig');
        break;
      case 'none':
        this.changeStatus('presentation', 'Red', 'Präsentation nicht gestartet');
        break;
      default:
        this.changeStatus('presentation', 'DarkGray', 'Status der Präsentation ungültig');
        break;
    }
  }

  setResponsesStatus(status: string): void {
    switch (status) {
      case 'yes':
      case 'some':
        this.changeStatus('responses', 'Yellow', 'Beantwortung unvollständig');
        break;
      case 'no':
      case 'none':
        this.changeStatus('responses', 'Red', 'bisher keine Beantwortung');
        break;
      case 'all':
      case 'complete':
        this.changeStatus('responses', 'LimeGreen', 'Beantwortung vollständig');
        break;
      case 'complete-and-valid':
        this.changeStatus('responses', 'LawnGreen', 'Beantwortung vollständig und gültig');
        break;
      default:
        this.changeStatus('responses', 'DarkGray', 'Status der Beantwortung ungültig');
        break;
    }
  }

  /**
   * Example Call: 'focus', 'Turquoise', 'Host hat den Fokus'
   * @param id          focus/responses/representation
   * @param newColor
   * @param description
   */
  private changeStatus(id: string, newColor: string, description: string): void {
    this.status[id].color = newColor;
    this.status[id].description = description;
  }
}
