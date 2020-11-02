import {
  Component, HostListener, OnDestroy, OnInit
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { TestControllerService } from '../test-controller.service';
import {
  KeyValuePairString, LogEntryKey, PageData, TaggedRestorePoint,
  TaggedString, WindowFocusState
} from '../test-controller.interfaces';
import { VeronaInterfacePlayerVersion } from '../app.classes';

declare let srcDoc: any;

@Component({
  selector: 'app-unit-host',
  templateUrl: './unit-host.component.html',
  styleUrls: ['./unit-host.component.scss']
})

export class UnitHostComponent implements OnInit, OnDestroy {
  private iFrameHostElement: HTMLElement = null;
  private iFrameItemplayer: HTMLIFrameElement = null;
  private routingSubscription: Subscription = null;
  public currentValidPages: string[] = [];

  public unitTitle = '';
  public showPageNav = false;

  private myUnitSequenceId = -1;
  private myUnitDbKey = '';

  private postMessageSubscription: Subscription = null;
  private itemplayerSessionId = '';
  private postMessageTarget: Window = null;
  private pendingUnitDefinition: TaggedString = null;
  private pendingUnitData: TaggedRestorePoint = null;
  public pageList: PageData[] = [];
  public playerRunning = true;
  public sendStopWithGetStateRequest = false;

  constructor(public tcs: TestControllerService, private route: ActivatedRoute) {
  }

  ngOnInit(): void {
    setTimeout(() => {
      this.iFrameHostElement = <HTMLElement>document.querySelector('#iFrameHost');
      this.tcs.setPresentationStatus('');
      this.tcs.setResponsesStatus('');

      this.routingSubscription = this.route.params.subscribe((params) => {
        this.myUnitSequenceId = Number(params.u);
        this.tcs.currentUnitSequenceId = this.myUnitSequenceId;
        this.unitTitle = this.tcs.unitList[this.myUnitSequenceId].filename;

        this.setupIFrameItemplayer();

        this.setPostMessageSubscriptions();

        this.setPageList([], '');

        if (this.tcs.unitList[this.myUnitSequenceId].restorePoint) {
          this.pendingUnitData = {
            tag: this.itemplayerSessionId,
            value: this.tcs.unitList[this.myUnitSequenceId].restorePoint
          };
        } else {
          this.pendingUnitData = null;
        }

        if (this.tcs.unitList[this.myUnitSequenceId].definition) {
          this.pendingUnitDefinition = {
            tag: this.itemplayerSessionId,
            value: this.tcs.unitList[this.myUnitSequenceId].definition
          };
        } else {
          this.pendingUnitDefinition = null;
        }
      });
    });
  }

  setupIFrameItemplayer(): void {
    while (this.iFrameHostElement.hasChildNodes()) {
      this.iFrameHostElement.removeChild(this.iFrameHostElement.lastChild);
    }
    this.itemplayerSessionId = Math.floor(Math.random() * 20000000 + 10000000).toString();
    this.iFrameItemplayer = <HTMLIFrameElement>document.createElement('iframe');
    this.iFrameItemplayer.setAttribute('sandbox', 'allow-forms allow-scripts allow-same-origin');
    this.iFrameItemplayer.setAttribute('class', 'unitHost');
    this.iFrameItemplayer.setAttribute('height', String(this.iFrameHostElement.clientHeight - 5));
    this.iFrameHostElement.appendChild(this.iFrameItemplayer);
    srcDoc.set(this.iFrameItemplayer, this.tcs.playerSourceCode);
  }

  @HostListener('window:resize')
  public onResize(): void {
    const divHeight = this.iFrameHostElement.clientHeight;
    this.iFrameItemplayer.setAttribute('height', String(divHeight - 5));
  }

  // ++++++++++++ page nav ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
  setPageList(validPages: string[], currentPage: string) {
    if ((validPages instanceof Array)) {
      const newPageList: PageData[] = [];
      if (validPages.length > 1) {
        for (let i = 0; i < validPages.length; i++) {
          if (i === 0) {
            newPageList.push({
              index: -1,
              id: '#previous',
              disabled: validPages[i] === currentPage,
              type: '#previous'
            });
          }

          newPageList.push({
            index: i + 1,
            id: validPages[i],
            disabled: validPages[i] === currentPage,
            type: '#goto'
          });

          if (i === validPages.length - 1) {
            newPageList.push({
              index: -1,
              id: '#next',
              disabled: validPages[i] === currentPage,
              type: '#next'
            });
          }
        }
      }
      this.pageList = newPageList;

    } else if ((this.pageList.length > 1) && (currentPage !== undefined)) {
      let currentPageIndex = 0;
      for (let i = 0; i < this.pageList.length; i++) {
        if (this.pageList[i].type === '#goto') {
          if (this.pageList[i].id === currentPage) {
            this.pageList[i].disabled = true;
            currentPageIndex = i;
          } else {
            this.pageList[i].disabled = false;
          }
        }
      }
      if (currentPageIndex === 1) {
        this.pageList[0].disabled = true;
        this.pageList[this.pageList.length - 1].disabled = false;
      } else {
        this.pageList[0].disabled = false;
        this.pageList[this.pageList.length - 1].disabled = currentPageIndex === this.pageList.length - 2;
      }
    }
    this.showPageNav = this.pageList.length > 0;
  }

  gotoPage(action: string, index = 0) {
    let nextPageId = '';
    // currentpage is detected by disabled-attribute of page
    if (action === '#next') {
      let currentPageIndex = 0;
      for (let i = 0; i < this.pageList.length; i++) {
        if ((this.pageList[i].index > 0) && (this.pageList[i].disabled)) {
          currentPageIndex = i;
          break;
        }
      }
      if ((currentPageIndex > 0) && (currentPageIndex < this.pageList.length - 2)) {
        nextPageId = this.pageList[currentPageIndex + 1].id;
      }
    } else if (action === '#previous') {
      let currentPageIndex = 0;
      for (let i = 0; i < this.pageList.length; i++) {
        if ((this.pageList[i].index > 0) && (this.pageList[i].disabled)) {
          currentPageIndex = i;
          break;
        }
      }
      if (currentPageIndex > 1) {
        nextPageId = this.pageList[currentPageIndex - 1].id;
      }
    } else if (action === '#goto') {
      if ((index > 0) && (index < this.pageList.length - 1)) {
        nextPageId = this.pageList[index].id;
      }
    } else if (index === 0) {
      // call from player
      nextPageId = action;
    }

    if (nextPageId.length > 0) {
      UnitHostComponent.log(this.myUnitDbKey, LogEntryKey.PAGENAVIGATIONSTART, nextPageId);
      if (typeof this.postMessageTarget !== 'undefined') {
        if (this.tcs.veronaInterfacePlayerVersion === VeronaInterfacePlayerVersion.v1x) {
          this.postMessageTarget.postMessage({
            type: 'vo.ToPlayer.NavigateToPage',
            sessionId: this.itemplayerSessionId,
            newPage: nextPageId
          }, '*');
        } else if (this.tcs.veronaInterfacePlayerVersion === VeronaInterfacePlayerVersion.v2_0) {
          this.postMessageTarget.postMessage({
            type: 'vopPageNavigationCommand',
            sessionId: this.itemplayerSessionId,
            target: nextPageId
          }, '*');
        }
      }
    }
  }

  private setPostMessageSubscriptions() {
    if (this.postMessageSubscription !== null) {
      this.postMessageSubscription.unsubscribe();
      this.postMessageSubscription = null;
    }

    if (this.tcs.veronaInterfacePlayerVersion === VeronaInterfacePlayerVersion.v1x) {
      this.setupV1Listener();
    } else {
      this.setupV2Listener();
    }
  }

  setupV1Listener(): void {
    console.log('tb: install old listeners');
    this.postMessageSubscription = this.tcs.postMessage$.subscribe((m: MessageEvent) => {
      const msgData = m.data;
      const msgType = msgData.type;
      let msgPlayerId = msgData.sessionId;
      if ((msgPlayerId === undefined) || (msgPlayerId === null)) {
        msgPlayerId = this.itemplayerSessionId;
      }

      if ((msgType !== undefined) && (msgType !== null)) {
        switch (msgType) {
          case 'vo.FromPlayer.ReadyNotification': {
            let pendingUnitDef = '';
            if (this.pendingUnitDefinition !== null) {
              if (this.pendingUnitDefinition.tag === msgPlayerId) {
                pendingUnitDef = this.pendingUnitDefinition.value;
                this.pendingUnitDefinition = null;
              }
            }
            let pendingRestorePoint = '';
            if (this.pendingUnitData !== null) {
              if (this.pendingUnitData.tag === msgPlayerId) {
                const pendingRestorePointList = this.pendingUnitData.value;
                if (pendingRestorePointList.hasOwnProperty('all')) {
                  pendingRestorePoint = pendingRestorePointList['all'];
                }
                this.pendingUnitData = null;
              }
            }
            UnitHostComponent.log(this.myUnitDbKey, LogEntryKey.PAGENAVIGATIONSTART, '#first');
            this.postMessageTarget = m.source as Window;
            if (typeof this.postMessageTarget !== 'undefined') {
              this.postMessageTarget.postMessage({
                type: 'vo.ToPlayer.DataTransfer',
                sessionId: this.itemplayerSessionId,
                unitDefinition: pendingUnitDef,
                restorePoint: pendingRestorePoint
              }, '*');
            }
            break;
          }
          case 'vo.FromPlayer.StartedNotification':
            if (msgPlayerId === this.itemplayerSessionId) {
              this.setPageList(msgData['validPages'], msgData['currentPage']);
              UnitHostComponent.log(this.myUnitDbKey, LogEntryKey.PAGENAVIGATIONCOMPLETE, msgData['currentPage']);
              const presentationComplete = msgData['presentationComplete'];
              if (presentationComplete) {
                this.tcs.unitList[this.myUnitSequenceId].presentationCompleteState =
                  msgData['presentationComplete'];
                UnitHostComponent.logPresentationComplete(this.myUnitDbKey, presentationComplete);
              }
              const responsesGiven = msgData['responsesGiven'];
              if (responsesGiven) {
                UnitHostComponent.logResponsesComplete(this.myUnitDbKey, responsesGiven);
              }
            }
            break;
          case 'vo.FromPlayer.ChangedDataTransfer':
            if (msgPlayerId === this.itemplayerSessionId) {
              this.setPageList(msgData['validPages'], msgData['currentPage']);
              if (msgData['currentPage'] !== undefined) {
                UnitHostComponent.log(this.myUnitDbKey, LogEntryKey.PAGENAVIGATIONCOMPLETE, msgData['currentPage']);
              }
              const restorePoint = msgData['restorePoint'] as string;
              if (restorePoint) {
                let newRestorePoint: KeyValuePairString = {};
                newRestorePoint['all'] = restorePoint;
                UnitHostComponent.logRestorePoint(this.myUnitDbKey, newRestorePoint);
                this.tcs.unitList[this.myUnitSequenceId].restorePoint = newRestorePoint;
              }
              const response = msgData['response'] as string;
              if (response !== undefined) {
                UnitHostComponent.logResponse(this.myUnitDbKey, response, msgData['responseConverter']);
              }
              const presentationComplete = msgData['presentationComplete'];
              if (presentationComplete) {
                this.tcs.setPresentationStatus(presentationComplete);
                this.tcs.unitList[this.myUnitSequenceId].presentationCompleteState =
                  msgData['presentationComplete'];
                UnitHostComponent.logPresentationComplete(this.myUnitDbKey, presentationComplete);
              }
              const responsesGiven = msgData['responsesGiven'];
              if (responsesGiven) {
                this.tcs.setResponsesStatus(msgData['responsesGiven']);
                UnitHostComponent.logResponsesComplete(this.myUnitDbKey, responsesGiven);
              }
            }
            break;
          case 'vo.FromPlayer.PageNavigationRequest':
            if (msgPlayerId === this.itemplayerSessionId) {
              this.gotoPage(msgData['newPage']);
            }
            break;
          case 'vo.FromPlayer.UnitNavigationRequest':
            if (msgPlayerId === this.itemplayerSessionId) {
              this.tcs.setUnitNavigationRequest(msgData['navigationTarget']);
            }
            break;
          default:
            console.log(`processMessagePost ignored message: ${msgType}`);
            break;
        }
      }
    });
  }

  setupV2Listener(): void {
    console.log('tb: install V2 listeners');
    this.postMessageSubscription = this.tcs.postMessage$.subscribe((m: MessageEvent) => {
      const msgData = m.data;
      const msgType = msgData.type;
      let msgPlayerId = msgData.sessionId;
      // TODO without sessionId the message should not be valid
      if ((msgPlayerId === undefined) || (msgPlayerId === null)) {
        msgPlayerId = this.itemplayerSessionId;
      }
      console.log(`tb: msgType "${msgType}"`);
      if ((msgType !== undefined) && (msgType !== null)) {
        switch (msgType) {
          case 'vopReadyNotification': {
            // TODO add apiVersion check
            let pendingUnitDef = '';
            if (this.pendingUnitDefinition !== null) {
              if (this.pendingUnitDefinition.tag === msgPlayerId) {
                pendingUnitDef = this.pendingUnitDefinition.value;
                this.pendingUnitDefinition = null;
              }
            }
            let pendingUnitDataToRestore: KeyValuePairString = {};
            if (this.pendingUnitData !== null) {
              if (this.pendingUnitData.tag === msgPlayerId) {
                pendingUnitDataToRestore = this.pendingUnitData.value;
                this.pendingUnitData = null;
              }
            }
            UnitHostComponent.log(this.myUnitDbKey, LogEntryKey.PAGENAVIGATIONSTART, '#first');
            this.postMessageTarget = m.source as Window;
            if (typeof this.postMessageTarget !== 'undefined') {
              this.postMessageTarget.postMessage({
                type: 'vopStartCommand',
                sessionId: this.itemplayerSessionId,
                unitDefinition: pendingUnitDef,
                unitState: {
                  dataParts: pendingUnitDataToRestore
                },
                playerConfig: this.tcs.playerConfig
              }, '*');
            }
            break;
          }
          case 'vopGetStateResponse':
          case 'vopStateChangedNotification':
            if (msgPlayerId === this.itemplayerSessionId) {
              if (msgData.playerState) {
                const playerState = msgData.playerState;
                this.setPageList(Object.keys(playerState.validPages), playerState.currentPage);
                // TODO UnitHostComponent.log(this.myUnitDbKey, LogEntryKey.PAGENAVIGATIONCOMPLETE, msgData['currentPage']);
              }
              if (msgData.unitState) {
                const unitState = msgData.unitState;
                const presentationProgress = unitState['presentationProgress'];
                if (presentationProgress) {
                  this.tcs.unitList[this.myUnitSequenceId].presentationCompleteState =
                    msgData['presentationComplete'];
                  UnitHostComponent.logPresentationComplete(this.myUnitDbKey,
                    presentationProgress);
                  this.tcs.setPresentationStatus(presentationProgress);
                  // TODO new enum presentationProgress
                }
                const responseProgress = unitState.responseProgress;
                if (responseProgress) {
                  UnitHostComponent.logResponsesComplete(this.myUnitDbKey, responseProgress);
                  this.tcs.setResponsesStatus(responseProgress);
                }
                const unitData = unitState.dataParts;
                if (unitData) {
                  UnitHostComponent.logResponse(this.myUnitDbKey, unitData, unitState['unitStateDataType']);
                  UnitHostComponent.logRestorePoint(this.myUnitDbKey, unitData);
                  this.tcs.unitList[this.myUnitSequenceId].restorePoint = unitData;
                }
              }
            }
            break;
          case 'vopUnitNavigationRequestedNotification':
            // TODO implement vopUnitNavigationRequestedNotification
            console.warn('vopUnitNavigationRequestedNotification received from player - not implemented');
            break;
          case 'vopWindowFocusChangedNotification':
            if (msgData.hasFocus) {
              this.tcs.windowFocusState$.next(WindowFocusState.PLAYER);
            } else if (document.hasFocus()) {
              this.tcs.windowFocusState$.next(WindowFocusState.HOST);
            } else {
              this.tcs.windowFocusState$.next(WindowFocusState.UNKNOWN);
            }
            break;
          default:
            console.log(`processMessagePost ignored message: ${msgType}`);
            break;
        }
      }
    });
  }

  displayGetStateButton(): boolean {
    return (this.tcs.veronaInterfacePlayerVersion === VeronaInterfacePlayerVersion.v2_0)
        && (this.tcs.playerConfig.stateReportPolicy === 'on-demand')
        && this.playerRunning
        && this.tcs.playerSupports('state-report-policy')
        && (this.tcs.veronaInterfacePlayerVersion === VeronaInterfacePlayerVersion.v2_0);
  }

  sendVopGetStateRequest(): void {
    this.postMessageTarget.postMessage({
      type: 'vopGetStateRequest',
      sessionId: this.itemplayerSessionId,
      stop: this.sendStopWithGetStateRequest
    }, '*');
    if (this.sendStopWithGetStateRequest) {
      this.playerRunning = false;
    }
  }

  displayContinueButton(): boolean {
    return (this.tcs.veronaInterfacePlayerVersion === VeronaInterfacePlayerVersion.v2_0) &&
        !this.playerRunning &&
        this.tcs.playerSupports('stop-continue');
  }

  sendVopContinueCommand(): void {
    this.playerRunning = true;
    this.postMessageTarget.postMessage({
      type: 'vopContinueCommand',
      sessionId: this.itemplayerSessionId
    }, '*');
  }

  displayStopButton(): boolean {
    return (this.tcs.veronaInterfacePlayerVersion === VeronaInterfacePlayerVersion.v2_0) &&
        this.playerRunning &&
        this.tcs.playerSupports('stop-continue');
  }

  sendVopStopCommand(): void {
    this.playerRunning = false;
    this.postMessageTarget.postMessage({
      type: 'vopStopCommand',
      sessionId: this.itemplayerSessionId
    }, '*');
  }

  ngOnDestroy(): void {
    this.routingSubscription.unsubscribe();
    this.postMessageSubscription.unsubscribe();
  }

  static log(unitKey: string, logKey: LogEntryKey, entry = ''): void {
    console.log(`UNIT LOG: unit${unitKey} - logKey ${logKey}${entry.length > 0 ? ` - entry "${JSON.stringify(entry)}"` : ''}`);
  }

  static logResponse(unitKey: string, response: string, responseType: string): void {
    const responseStr = JSON.stringify(response);
    console.log(`UNIT RESPONSES: unit${unitKey} - "${responseStr.substr(0, Math.min(40, response.length))}", type: "${responseType}"`);
  }

  static logPresentationComplete(unitKey: string, presentationComplete: string): void {
    console.log(`UNIT PRESENTATION_COMPLETE: unit${unitKey} - "${presentationComplete}"`);
  }

  static logResponsesComplete(unitDbKey: string, responsesGiven: string): void {
    UnitHostComponent.log(unitDbKey, LogEntryKey.RESPONSESCOMPLETE, responsesGiven);
  }

  static logRestorePoint(unitKey: string, restorePoint: KeyValuePairString): void {
    const restorePointStr = JSON.stringify(restorePoint);
    console.log(`UNIT RESTORE_POINT: unit${unitKey} ---${restorePointStr.substr(0, Math.min(40, restorePointStr.length))}---`);
  }
}
