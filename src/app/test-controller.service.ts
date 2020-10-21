import { ElementRef, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import {
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
  public playerName = '';
  public playerSourceCode = '';
  public unitList: UnitData[] = [];

  public fileSelectElement: ElementRef;
  private uploadFileType: UploadFileType;
  private _currentUnitSequenceId: number;
  public suppressPlayerConsoleMessages = true;
  public postMessage$ = new Subject<MessageEvent>();
  public windowFocusState$ = new Subject<WindowFocusState>();
  public veronaInterfacePlayerVersion = VeronaInterfacePlayerVersion.v2_0;

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
    for (let sequ = 0; sequ < this.unitList.length; sequ++) {
      this.unitList[sequ].isCurrent = sequ === v;
    }
    this._currentUnitSequenceId = v;
  }

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
    this.playerName = '';
    this.currentUnitSequenceId = 0;
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
          this.router.navigateByUrl('/u/0');
          break;
        case UnitNavigationTarget.LAST:
          this.router.navigateByUrl(`/u/${this.unitList.length - 1}`);
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

  uploadFile(fileInputEvent: InputEvent): void {
    // TODO async/feedback/show progress
    // TODO bug: uploadFileType might be changed before upload finished
    const target = fileInputEvent.target as HTMLInputElement;
    switch (this.uploadFileType) {
      case UploadFileType.UNIT: {
        for (let sequ = 0; sequ < target.files.length; sequ++) {
          let unit = this.unitList.find((e) => e.filename === target.files[sequ].name);
          if (unit) {
            unit.loadDefinition(target.files[sequ]);
          } else {
            unit = new UnitData(target.files[sequ].name, this.unitList.length);
            this.unitList.push(unit);
            unit.loadDefinition(target.files[sequ]);
          }
        }
        break;
      }
      case UploadFileType.PLAYER: {
        const myReader = new FileReader();
        myReader.onload = (e) => {
          this.playerSourceCode = e.target.result as string;
        };
        this.playerName = target.files[0].name;
        myReader.readAsText(target.files[0]);
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
