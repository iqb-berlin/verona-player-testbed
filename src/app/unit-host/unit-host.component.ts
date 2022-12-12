/* eslint-disable no-console */
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

@Component({
  templateUrl: './unit-host.component.html',
  styleUrls: ['./unit-host.component.scss']
})

export class UnitHostComponent implements OnInit, OnDestroy {
  private iFrameHostElement: HTMLElement | null = null;
  private iFrameItemplayer: HTMLIFrameElement | null = null;
  private routingSubscription: Subscription | null = null;
  currentValidPages: string[] = [];

  unitTitle: string = '';
  showPageNav = false;

  private postMessageSubscription: Subscription | null = null;
  private itemplayerSessionId: string = Math.floor(Math.random() * 20000000 + 10000000).toString();
  private postMessageTarget: Window | null = null;
  private pendingUnitDefinition: TaggedString | null = null;
  private pendingUnitData: TaggedRestorePoint | null = null;
  pageList: PageData[] = [];
  playerRunning = true;
  sendStopWithGetStateRequest = false;

  constructor(public tcs: TestControllerService, private route: ActivatedRoute) { }

  ngOnInit(): void {
    setTimeout(() => {
      this.iFrameHostElement = <HTMLElement>document.querySelector('#iFrameHost');
      this.routingSubscription = this.route.params.subscribe(params => {
        this.tcs.currentUnitSequenceId = Number(params['u']);
        this.unitTitle = this.tcs.unitList[this.tcs.currentUnitSequenceId].filename;

        this.setPageList([], '');
        this.setupPostMessageSubscriptions();

        if (this.tcs.unitList[this.tcs.currentUnitSequenceId].restorePoint) {
          this.pendingUnitData = {
            tag: this.itemplayerSessionId,
            value: this.tcs.unitList[this.tcs.currentUnitSequenceId].restorePoint
          };
        } else {
          this.pendingUnitData = null;
        }

        if (this.tcs.unitList[this.tcs.currentUnitSequenceId].definition) {
          this.pendingUnitDefinition = {
            tag: this.itemplayerSessionId,
            value: this.tcs.unitList[this.tcs.currentUnitSequenceId].definition
          };
        } else {
          this.pendingUnitDefinition = null;
        }

        this.setupIFrameItemplayer();
      });
    });
  }

  setupIFrameItemplayer(): void {
    if (this.iFrameHostElement) {
      while (this.iFrameHostElement.lastChild) {
        this.iFrameHostElement.removeChild(this.iFrameHostElement.lastChild);
      }
      this.iFrameItemplayer = <HTMLIFrameElement>document.createElement('iframe');
      this.iFrameItemplayer.setAttribute('sandbox', 'allow-forms allow-scripts allow-popups allow-same-origin');
      this.iFrameItemplayer.setAttribute('class', 'unitHost');
      this.iFrameItemplayer.setAttribute('height', String(this.iFrameHostElement.clientHeight - 5));
      this.iFrameHostElement.appendChild(this.iFrameItemplayer);
      this.iFrameItemplayer.setAttribute('srcdoc', this.tcs.playerSourceCode);
    }
  }

  @HostListener('window:resize')
  onResize(): void {
    if (this.iFrameHostElement && this.iFrameItemplayer) {
      const divHeight = this.iFrameHostElement.clientHeight;
      this.iFrameItemplayer.setAttribute('height', String(divHeight - 5));
    }
  }

  // ++++++++++++ page nav ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
  setPageList(validPages: string[], currentPage: string): void {
    if ((validPages.length > 0)) {
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

  gotoPage(action: string, index = 0): void {
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
      UnitHostComponent.log(LogEntryKey.PAGENAVIGATIONSTART, nextPageId);
      if (this.postMessageTarget) {
        this.postMessageTarget.postMessage({
          type: 'vopPageNavigationCommand',
          sessionId: this.itemplayerSessionId,
          target: nextPageId
        }, '*');
      }
    }
  }

  private setupPostMessageSubscriptions() {
    if (this.postMessageSubscription !== null) {
      this.postMessageSubscription.unsubscribe();
      this.postMessageSubscription = null;
    }
    this.setupVopListener();
  }

  setupVopListener(): void {
    this.postMessageSubscription = this.tcs.postMessage$.subscribe((m: MessageEvent) => {
      const msgData = m.data;
      const msgType = msgData.type;
      let msgPlayerId = msgData.sessionId;
      // TODO without sessionId the message should not be valid
      if (!msgPlayerId) {
        msgPlayerId = this.itemplayerSessionId;
      }
      switch (msgType) {
        case 'vopReadyNotification': {
          // TODO add apiVersion check
          if (m.data.metadata) {
            console.log('player-Metadata received:', m.data.metadata);
          }
          let pendingUnitDef = '';
          if (this.pendingUnitDefinition !== null) {
            if (this.pendingUnitDefinition.tag === msgPlayerId) {
              pendingUnitDef = this.pendingUnitDefinition.value;
              this.pendingUnitDefinition = null;
            }
          }
          let pendingUnitDataToRestore: KeyValuePairString = {};
          if (this.pendingUnitData && this.pendingUnitData.tag === msgPlayerId) {
            pendingUnitDataToRestore = this.pendingUnitData.value;
            this.pendingUnitData = null;
          }
          UnitHostComponent.log(LogEntryKey.PAGENAVIGATIONSTART, '#first');
          this.postMessageTarget = m.source as Window;
          if (typeof this.postMessageTarget !== 'undefined') {
            this.postMessageTarget.postMessage({
              type: 'vopStartCommand',
              sessionId: this.itemplayerSessionId,
              unitDefinition: pendingUnitDef,
              unitState: {
                dataParts: pendingUnitDataToRestore
              },
              playerConfig: this.tcs.fullPlayerConfig
            }, '*');
          }
          break;
        }
        case 'vopStateChangedNotification':
          if (msgPlayerId === this.itemplayerSessionId) {
            if (msgData.playerState) {
              const playerState = msgData.playerState;
              this.setPageList(
                playerState.validPages ? Object.keys(playerState.validPages) : [], playerState.currentPage
              );
            }
            if (msgData.unitState) {
              const unitState = msgData.unitState;
              const { presentationProgress } = unitState;
              if (presentationProgress) {
                this.tcs.unitList[this.tcs.currentUnitSequenceId].presentationCompleteState =
                  presentationProgress;
                this.tcs.presentationStatus = presentationProgress;
              }
              const { responseProgress } = unitState;
              if (responseProgress) {
                UnitHostComponent.logResponsesComplete(responseProgress);
                this.tcs.responseStatus = responseProgress;
              }
              const { dataParts } = unitState;
              const { unitStateDataType } = unitState;
              if (dataParts as string) {
                UnitHostComponent.logResponse(dataParts, unitStateDataType);
                UnitHostComponent.logRestorePoint(dataParts);
                this.tcs.unitList[this.tcs.currentUnitSequenceId].restorePoint = dataParts;
              }
            }
          }
          break;
        case 'vopUnitNavigationRequestedNotification':
          this.tcs.setUnitNavigationRequest(msgData.target || msgData.targetRelative.substr(1));
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
          console.log(`TestBed: postMessage ignored: ${msgType}`);
          break;
      }
    });
  }

  sendDenyNavigation(): void {
    if (this.postMessageTarget) {
      const denyReasons: string[] = [];
      if (this.tcs.presentationStatus !== 'complete') denyReasons.push('presentationIncomplete');
      if (this.tcs.responseStatus !== 'complete') denyReasons.push('responsesIncomplete');
      this.postMessageTarget.postMessage({
        type: 'vopNavigationDeniedNotification',
        sessionId: this.itemplayerSessionId,
        reason: denyReasons
      }, '*');
    }
  }

  ngOnDestroy(): void {
    if (this.routingSubscription) this.routingSubscription.unsubscribe();
    if (this.postMessageSubscription) this.postMessageSubscription.unsubscribe();
  }

  static log(logKey: LogEntryKey, entry = ''): void {
    console.log(`UNIT LOG: ${logKey}${entry.length > 0 ? ` - entry: "${JSON.stringify(entry)}"` : ''}`);
  }

  static logResponse(response: string, responseType: string): void {
    const responseStr = JSON.stringify(response);
    console.log(`UNIT RESPONSES: ${responseStr}, type: "${responseType}"`);
  }

  static logPresentationProgress(presentationComplete: string): void {
    console.log(`UNIT PRESENTATION_COMPLETE: "${presentationComplete}"`);
  }

  static logResponsesComplete(responsesGiven: string): void {
    UnitHostComponent.log(LogEntryKey.RESPONSESCOMPLETE, responsesGiven);
  }

  static logRestorePoint(restorePoint: KeyValuePairString): void {
    const restorePointStr = JSON.stringify(restorePoint);
    console.log(`UNIT RESTORE_POINT: ${restorePointStr.substr(0, Math.min(40, restorePointStr.length))}---`);
  }
}
