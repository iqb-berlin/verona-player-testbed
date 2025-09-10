import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

import {
  UnitNavigationTarget,
  WindowFocusState
} from '../interfaces/test-controller.interfaces';
import { UnitData } from '../models/app.classes';
import { VeronaMetadata } from '../models/verona-metadata.class';

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
    pagingMode: 'separate' | 'concat-scroll' | 'concat-scroll-snap',
    logPolicy: 'lean' | 'rich' | 'debug' | 'disabled',

    directDownloadUrl: string
  } = {
      enableNavigationTargetEnd: true,
      pagingMode: 'separate',
      logPolicy: 'rich',
      directDownloadUrl: ''
    };

  controllerSettings: {
    reloadPlayer: boolean
  } = {
      reloadPlayer: false
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

  get fullPlayerConfig() {
    const navigationTargets: string[] = [];
    if (this.playerConfig.enableNavigationTargetEnd) navigationTargets.push(UnitNavigationTarget.END);
    if (this.currentUnitSequenceId > 0) {
      navigationTargets.push(UnitNavigationTarget.PREVIOUS);
      navigationTargets.push(UnitNavigationTarget.FIRST);
    }
    if (this.currentUnitSequenceId < this.unitList.length - 1) {
      navigationTargets.push(UnitNavigationTarget.NEXT);
      navigationTargets.push(UnitNavigationTarget.LAST);
    }

    return {
      unitNumber: this.currentUnitSequenceId + 1,
      unitTitle: this.currentUnitTitle,
      unitId: this.currentUnitTitle,
      logPolicy: this.playerConfig.logPolicy,
      pagingMode: this.playerConfig.pagingMode,
      stateReportPolicy: 'eager',
      enabledNavigationTargets: navigationTargets,
      directDownloadUrl: this.playerConfig.directDownloadUrl
    };
  }

  constructor(private router: Router) {
    this.windowFocusState$.pipe(
      debounceTime(100)
    ).subscribe((newState: WindowFocusState) => {
      this.focusStatus = newState;
    });
  }

  setUnitNavigationRequest(navString: string = UnitNavigationTarget.NEXT): void {
    switch (navString) {
      case UnitNavigationTarget.MENU:
      case UnitNavigationTarget.ERROR:
      case UnitNavigationTarget.PAUSE:
      case UnitNavigationTarget.END:
        this.router.navigateByUrl('/h');
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

  uploadUnitFile(fileInputEvent: Event): void {
    const target = fileInputEvent.target as HTMLInputElement;
    if (target && target.files && target.files.length > 0) {
      const filesToUpload = target.files;
      for (let i = 0; i < filesToUpload.length; i++) {
        let unit = this.unitList.find(e => e.unitId === filesToUpload[i].name);
        if (unit) {
          unit.loadDefinition(filesToUpload[i]);
          unit.clearResponses();
        } else {
          unit = new UnitData(filesToUpload[i].name, this.unitList.length);
          this.unitList.push(unit);
          unit.loadDefinition(filesToUpload[i]);
        }
      }
    }
  }

  uploadPlayerFile(fileInputEvent: Event): void {
    const target = fileInputEvent.target as HTMLInputElement;
    if (target && target.files && target.files.length > 0) {
      const fileToUpload = target.files[0];
      const myReader = new FileReader();
      myReader.onload = e => {
        this.playerSourceCode = e.target ? (e.target.result as string) : '';
        this.playerMeta = new VeronaMetadata(fileToUpload.name, this.playerSourceCode);
        if (!this.playerMeta.moduleOk) this.playerSourceCode = '';
      };
      myReader.readAsText(fileToUpload);
    }
  }

  // eslint-disable-next-line class-methods-use-this
  playerSupports(feature: string): boolean {
    return true;
  }
}
