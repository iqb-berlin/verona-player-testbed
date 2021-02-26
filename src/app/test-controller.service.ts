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
import { UnitData, VeronaInterfacePlayerVersion } from './app.classes';

@Injectable({
  providedIn: 'root'
})
export class TestControllerService {
  public playerName = '';
  public playerSourceCode = '';
  public unitList: UnitData[] = [];

  private _currentUnitSequenceId: number = null;
  public currentUnitTitle = '';
  public postMessage$ = new Subject<MessageEvent>();
  public windowFocusState$ = new Subject<WindowFocusState>();
  public veronaInterfacePlayerVersion = VeronaInterfacePlayerVersion.v2_0;

  public playerConfig: {
    stateReportPolicy: 'none' | 'eager' | 'on-demand',
    pagingMode: 'separate' | 'concat-scroll' | 'concat-scroll-snap',
    logPolicy: 'lean' | 'rich' | 'debug' | 'disabled'
  } = {
    stateReportPolicy: 'eager',
    pagingMode: 'separate',
    logPolicy: 'rich'
  };

  public notSupportedApiFeatures: string[] = [];
  // @see https://github.com/verona-interfaces/player/blob/master/api/playermetadata.md
  public notSupportedApiFeatureDescriptions = {
    'stop-continue': 'the player will not handle the host\'s vopStopCommand and vopContinueCommand',
    'focus-notify': 'the player will not send vopWindowsFocusChangedNotification in case',
    'state-report-policy': 'the player will not comply with playerConfig.stateReportPolicy of vopStartCommand ' +
                           'and will not handle the host\'s vopGetStateRequest',
    'log-policy': 'the player will ignore playerConfig.logPolicy of vopStartCommand',
    'paging-mode': 'the player will ignore playerConfig.pagingMode of vopStartCommand'
  };

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
      description: 'Fokus unbekannt'
    }
  };

  public playerMeta = {};

  public get currentUnitSequenceId(): number {
    return this._currentUnitSequenceId;
  }

  public set currentUnitSequenceId(v: number) {
    for (let i = 0; i < this.unitList.length; i++) {
      this.unitList[i].isCurrent = i === v;
    }
    this._currentUnitSequenceId = v;
  }

  constructor(private router: Router) {
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
    this.currentUnitTitle = '';
  }

  public setUnitNavigationRequest(navString: string = UnitNavigationTarget.NEXT): void {
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

  uploadFile(fileInputEvent: InputEvent, uploadedFileType: UploadFileType): void {
    // TODO async/feedback/show progress
    // TODO bug: uploadFileType might be changed before upload finished
    const target = fileInputEvent.target as HTMLInputElement;
    switch (uploadedFileType) {
      case UploadFileType.UNIT: {
        for (let seq = 0; seq < target.files.length; seq++) {
          let unit = this.unitList.find(e => e.filename === target.files[seq].name);
          if (unit) {
            unit.loadDefinition(target.files[seq]);
          } else {
            unit = new UnitData(target.files[seq].name, this.unitList.length);
            this.unitList.push(unit);
            unit.loadDefinition(target.files[seq]);
          }
        }
        break;
      }
      case UploadFileType.PLAYER: {
        const myReader = new FileReader();
        myReader.onload = e => {
          this.playerSourceCode = e.target.result as string;
          this.readPlayerMeta(e.target.result as string);
        };
        this.playerName = target.files[0].name;
        myReader.readAsText(target.files[0]);
        break;
      }
      // no default
    }
  }

  readPlayerMeta(playerCode: string): void {
    const playerDom = document.implementation.createHTMLDocument('player');
    playerDom.open();
    playerDom.write(playerCode);
    playerDom.close();
    const metaElem: HTMLElement = playerDom.querySelector('meta[data-version]');
    if (!metaElem || !metaElem.dataset) {
      this.playerMeta = {};
      this.notSupportedApiFeatures = [];
    } else {
      this.playerMeta = metaElem.dataset;
      if (metaElem.dataset.notSupportedApiFeatures) {
        this.notSupportedApiFeatures = metaElem.dataset.notSupportedApiFeatures.split(' ');
      } else {
        this.notSupportedApiFeatures = [];
      }
    }
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

  playerSupports(feature: string): boolean {
    return (this.notSupportedApiFeatures.indexOf(feature) === -1);
  }
}
