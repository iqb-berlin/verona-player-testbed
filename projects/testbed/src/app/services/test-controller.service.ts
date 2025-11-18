import { inject, Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

import { PlayerConfig, SharedParameter } from '../../../../verona/src/lib/verona.interfaces';

import { UnitNavigationTarget, WindowFocusState } from '../interfaces/test-controller.interfaces';
import { ChunkData, UnitData } from '../models/app.classes';
import { VeronaMetadata } from '../models/verona-metadata.class';
import { BroadcastService } from './broadcast.service';
import { LogService } from './log.service';

@Injectable({
  providedIn: 'root'
})

export class TestControllerService {
  router = inject(Router);
  broadcastService = inject(BroadcastService);
  componentName = 'TestControllerService';

  playerSourceCode = '';
  unitList: UnitData[] = [];
  private _playerMeta = signal<VeronaMetadata | undefined>(undefined);
  playerMeta = this._playerMeta.asReadonly();
  private _currentUnitSequenceId = signal(-1);
  currentUnitSequenceId = this._currentUnitSequenceId.asReadonly();

  currentUnitTitle = '';
  postMessage$ = new Subject<MessageEvent>();

  private restartMessage$ = new BehaviorSubject(-1);
  getRestartMessage$ = this.restartMessage$.asObservable();
  private configChangedMessage$ = new BehaviorSubject(-1);
  getConfigChangedMessage$ = this.configChangedMessage$.asObservable();

  windowFocusState$ = new Subject<WindowFocusState>();
  private _presentationStatus = signal('');
  presentationStatus = this._presentationStatus.asReadonly();
  private _responseStatus = signal('');
  responseStatus = this._responseStatus.asReadonly();
  private _focusStatus = signal('');
  focusStatus = this._focusStatus.asReadonly();

  enabledNavigationTargets = ['first', 'last', 'previous', 'next', 'end'];

  forceResponseComplete = 'OFF';
  forcePresentationComplete = 'OFF';
  playerConfig: PlayerConfig = {
    pagingMode: 'separate',
    logPolicy: 'rich',
    printMode: 'off',
    directDownloadUrl: ''
  };

  sharedParameters: SharedParameter[] = [];

  controllerSettings: {
    reloadPlayer: boolean
  } = {
      reloadPlayer: false
    };

  constructor() {
    this.windowFocusState$.pipe(
      debounceTime(100)
    ).subscribe((newState: WindowFocusState) => {
      this._focusStatus.set(newState);
    });
  }

  addSharedParameters(parameters: SharedParameter[]) {
    parameters.forEach(para => {
      if (para.value) {
        this.addSharedParameter(para.key, para.value);
      }
    });
    this.broadcastService.publish({
      type: 'sharedParametersChanged',
      sharedParameters: this.sharedParameters
    });
  }

  private addSharedParameter(key: string, value: string) {
    const param = this.sharedParameters.find(p => p.key === key);
    if (param) {
      param.value = value;
    } else {
      const newParameter: SharedParameter = {
        key: key,
        value: value
      };
      this.sharedParameters.push(newParameter);
    }
  }

  setCurrentUnitSequenceId(v: number) {
    for (let i = 0; i < this.unitList.length; i++) {
      this.unitList[i].isCurrent = i === v;
    }
    this._currentUnitSequenceId.set(v);
  }

  setPresentationStatus(v: string) {
    this._presentationStatus.set(v);
  }

  setResponseStatus(v: string) {
    this._responseStatus.set(v);
  }

  setPlayerMeta(v: VeronaMetadata) {
    this._playerMeta.set(v);
  }

  get fullPlayerConfig() {
    const navigationTargets: string[] = [];

    if (this.enabledNavigationTargets?.includes(UnitNavigationTarget.END)) {
      navigationTargets.push(UnitNavigationTarget.END);
    }
    if (this.currentUnitSequenceId() > 0) {
      if (this.enabledNavigationTargets?.includes(UnitNavigationTarget.PREVIOUS)) {
        navigationTargets.push(UnitNavigationTarget.PREVIOUS);
      }
      if (this.enabledNavigationTargets?.includes(UnitNavigationTarget.FIRST)) {
        navigationTargets.push(UnitNavigationTarget.FIRST);
      }
    }
    if (this.currentUnitSequenceId() < this.unitList.length - 1) {
      if (this.enabledNavigationTargets?.includes(UnitNavigationTarget.NEXT)) {
        navigationTargets.push(UnitNavigationTarget.NEXT);
      }
      if (this.enabledNavigationTargets?.includes(UnitNavigationTarget.LAST)) {
        navigationTargets.push(UnitNavigationTarget.LAST);
      }
    }

    return {
      unitNumber: this.currentUnitSequenceId() + 1,
      unitTitle: this.currentUnitTitle,
      unitId: this.currentUnitTitle,
      logPolicy: this.playerConfig.logPolicy,
      pagingMode: this.playerConfig.pagingMode,
      enabledNavigationTargets: navigationTargets,
      directDownloadUrl: this.playerConfig.directDownloadUrl
    };
  }

  checkUnitNavigationRequest(navString: string): boolean {
    if (this.forcePresentationComplete === 'OFF' && this.forceResponseComplete === 'OFF') {
      return true;
    }
    if (this.forcePresentationComplete === 'ALWAYS' && this.presentationStatus() !== 'complete') {
      return false;
    }
    if (this.forceResponseComplete === 'ALWAYS' && this.responseStatus() !== 'complete') {
      return false;
    }
    if (this.forcePresentationComplete === 'ON' && this.presentationStatus() !== 'complete' &&
      navString === UnitNavigationTarget.NEXT) {
      return false;
    }
    if (this.forceResponseComplete === 'ON' && this.responseStatus() !== 'complete' &&
      navString === UnitNavigationTarget.NEXT) {
      return false;
    }
    return true;
  }

  setUnitNavigationRequest(navString: string = UnitNavigationTarget.NEXT): void {
    switch (navString) {
      case UnitNavigationTarget.END:
        this.router.navigateByUrl('/h');
        break;
      case UnitNavigationTarget.NEXT:
        if (this.currentUnitSequenceId() === undefined) {
          this.setCurrentUnitSequenceId(0);
          this.router.navigateByUrl(`/u/${this.currentUnitSequenceId()}`);
        } else if (this.currentUnitSequenceId() < this.unitList.length - 1) {
          this.router.navigateByUrl(`/u/${this.currentUnitSequenceId() + 1}`);
        } else {
          // eslint-disable-next-line no-console
          console.warn('Navigation to non existing unit!');
        }
        break;
      case UnitNavigationTarget.PREVIOUS:
        if (this.currentUnitSequenceId() > 0 && this.unitList.length > 0) {
          this.router.navigateByUrl(`/u/${this.currentUnitSequenceId() - 1}`);
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

  clearResponses(): void {
    this.unitList.forEach((u: { clearResponses: () => any; }) => u.clearResponses());
  }

  getAllResponses() {
    let allResponses: { [key: string]: ChunkData[] } = {};
    let hasSubForms = false;

    LogService.debug(this.componentName, ':', 'allResponses', this.unitList);

    this.unitList.forEach((u: any) => {
      allResponses[u.unitId] = u.getResponsesTransformed();
      if (!hasSubForms) {
        const chunkHavingSubform = allResponses[u.unitId].find(chunk => {
          const firstSubFormResponse = chunk.variables.find((v: any) => !!v.subform);
          return firstSubFormResponse ? chunk : null;
        });
        hasSubForms = !!chunkHavingSubform;
      }
    });

    return allResponses;
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
      this.broadcastService.publish({
        type: 'clearResponses'
      });
    }
  }

  uploadPlayerFile(fileInputEvent: Event): void {
    const target = fileInputEvent.target as HTMLInputElement;
    if (target && target.files && target.files.length > 0) {
      const fileToUpload = target.files[0];
      const myReader = new FileReader();
      myReader.onload = e => {
        this.playerSourceCode = e.target ? (e.target.result as string) : '';
        this.setPlayerMeta(new VeronaMetadata(fileToUpload.name, this.playerSourceCode));
        if (!this.playerMeta()?.moduleOk) this.playerSourceCode = '';
      };
      myReader.readAsText(fileToUpload);
    }
  }

  restartPlayer(): void {
    this.restartMessage$.next(this._currentUnitSequenceId());
  }

  applyConfigChanges() {
    this.configChangedMessage$.next(this._currentUnitSequenceId());
  }

  // eslint-disable-next-line class-methods-use-this
  // playerSupports(feature: string): boolean {
  //   return true;
  // }
}
