import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import {
  StatusVisual,
  UnitNavigationTarget,
  UploadFileType,
  WindowFocusState
} from './test-controller.interfaces';
import { UnitData } from './app.classes';
import { VeronaMetadata } from "./home/verona-metadata.class";

@Injectable({
  providedIn: 'root'
})
export class TestControllerService {
  playerSourceCode = '';
  unitList: UnitData[] = [];
  playerMeta: VeronaMetadata | null = null;

  private _currentUnitSequenceId: number = -1;
  currentUnitTitle = '';
  postMessage$ = new Subject<MessageEvent>();
  windowFocusState$ = new Subject<WindowFocusState>();
  presentationStatus = '';
  responseStatus = '';
  focusStatus = '';

  playerConfig: {
    enableNavigationTargetEnd: boolean,
    stateReportPolicy: 'none' | 'eager' | 'on-demand',
    pagingMode: 'separate' | 'concat-scroll' | 'concat-scroll-snap',
    logPolicy: 'lean' | 'rich' | 'debug' | 'disabled',
    directDownloadUrl: string
  } = {
      enableNavigationTargetEnd: true,
      stateReportPolicy: 'eager',
      pagingMode: 'separate',
      logPolicy: 'rich',
      directDownloadUrl: '',
    };

  controllerSettings: {
    reloadPlayer: boolean,
    denyOnResponsesIncomplete: boolean,
    denyOnPresentationIncomplete: boolean
  } = {
    reloadPlayer: false,
    denyOnResponsesIncomplete: false,
    denyOnPresentationIncomplete: false
  }
  status: { [name: string]: StatusVisual } = {
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
      description: 'Fokus unbekannt'
    }
  };

  get currentUnitSequenceId(): number {
    return this._currentUnitSequenceId;
  }

  set currentUnitSequenceId(v: number) {
    for (let i = 0; i < this.unitList.length; i++) {
      this.unitList[i].isCurrent = i === v;
    }
    this._currentUnitSequenceId = v;
  }

  constructor(private router: Router) {
    this.windowFocusState$.pipe(
      debounceTime(100)
    ).subscribe((newState: WindowFocusState) => {
      this.focusStatus = newState
    });
  }

  setUnitNavigationRequest(navString: string = UnitNavigationTarget.NEXT): void {
    switch (navString) {
      case UnitNavigationTarget.MENU:
      case UnitNavigationTarget.ERROR:
      case UnitNavigationTarget.PAUSE:
      case UnitNavigationTarget.END:
        this.router.navigateByUrl('/r');
        break;
      case UnitNavigationTarget.NEXT:
        if (this.currentUnitSequenceId === null) {
          this.currentUnitSequenceId = 0;
          this.router.navigateByUrl(`/u/${this.currentUnitSequenceId}`);
        } else if (this.currentUnitSequenceId < this.unitList.length - 1) {
          this.router.navigateByUrl(`/u/${this.currentUnitSequenceId + 1}`);
        } else {
          // eslint-disable-next-line no-console
          console.warn('Navigation to non existing unit!');
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

  uploadFile(fileInputEvent: Event, uploadedFileType: UploadFileType): void {
    // TODO async/feedback/show progress
    // TODO bug: uploadFileType might be changed before upload finished
    const target = fileInputEvent.target as HTMLInputElement;
    if (target && target.files && target.files.length > 0) {
      const filesToUpload = target.files;
      switch (uploadedFileType) {
        case UploadFileType.UNIT: {
          for (let i = 0; i < filesToUpload.length; i++) {
            let unit = this.unitList.find(e => e.filename === filesToUpload[i].name);
            if (unit) {
              unit.loadDefinition(filesToUpload[i]);
              unit.restorePoint = {};
            } else {
              unit = new UnitData(filesToUpload[i].name, this.unitList.length);
              this.unitList.push(unit);
              unit.loadDefinition(filesToUpload[i]);
            }
          }
          break;
        }
        case UploadFileType.PLAYER: {
          const myReader = new FileReader();
          myReader.onload = e => {
            this.playerSourceCode = e.target ? (e.target.result as string) : '';
            this.playerMeta = new VeronaMetadata(filesToUpload[0].name, this.playerSourceCode);
            if (!this.playerMeta.moduleOk) this.playerSourceCode = '';
          };
          myReader.readAsText(filesToUpload[0]);
          break;
        }
        // no default
      }
    }
  }

  playerSupports(feature: string): boolean {
    return true;
  }
}
