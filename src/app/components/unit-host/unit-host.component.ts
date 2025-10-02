import {
  ChangeDetectorRef, Component, HostListener, inject, OnDestroy, OnInit
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';

import { TestControllerService } from '../../services/test-controller.service';
import {
  DictionaryStringString,
  PageData,
  TaggedRestorePoint,
  TaggedString,
  WindowFocusState
} from '../../interfaces/test-controller.interfaces';
import { VeronaSubscriptionService } from '../../../../projects/verona/src/lib/host/verona-subscription.service';
import { VopStateChangedNotification } from '../../../../projects/verona/src/lib/verona.interfaces';
import { BroadcastService } from '../../services/broadcast.service';
import { ShowResponsesDialogComponent } from '../responses/show-responses-dialog.component';
import { StatusComponent } from '../status/status.component';

@Component({
  templateUrl: './unit-host.component.html',
  imports: [
    StatusComponent
  ],
  styleUrls: ['./unit-host.component.scss']
})

export class UnitHostComponent implements OnInit, OnDestroy {
  broadcastService = inject(BroadcastService);
  cdRef = inject(ChangeDetectorRef);
  veronaSubscriptionService = inject(VeronaSubscriptionService);

  private iFrameHostElement: HTMLElement | null = null;
  private iFrameItemplayer: HTMLIFrameElement | null = null;
  private routingSubscription: Subscription | null = null;
  private postMessageSubscription: Subscription | null = null; // TODO remove in exchange for veronaSubscriptionService
  private broadcastSubscription = new Subscription();

  currentValidPages: string[] = [];
  unitTitle: string = '';
  showPageNav = false;
  private itemPlayerSessionId = '';
  private postMessageTarget: Window | null = null;
  private pendingUnitDefinition: TaggedString | null = null;
  private pendingUnitData: TaggedRestorePoint | null = null;
  pageList: PageData[] = [];
  playerRunning = true;
  // sendStopWithGetStateRequest = false;

  constructor(
    public tcs: TestControllerService,
    private route: ActivatedRoute,
    private showResponsesDialog: MatDialog
  ) {
    this.tcs.getRestartMessage$.subscribe(restartMessage => {
      if (restartMessage) {
        this.setupIFrameItemPlayer();
        this.sendUnitStartCommand();
      }
    });
  }

  ngOnInit(): void {
    setTimeout(() => {
      this.iFrameHostElement = <HTMLElement>document.querySelector('#iFrameHost');

      this.setupVopListener();

      this.routingSubscription = this.route.params.subscribe(params => {
        this.tcs.setCurrentUnitSequenceId(Number(params['u']));
        this.unitTitle = this.tcs.unitList[this.tcs.currentUnitSequenceId()].unitId;
        this.itemPlayerSessionId = UnitHostComponent.getNewSessionId();
        this.setPageList([], '');

        const storedUnitData = this.tcs.unitList[this.tcs.currentUnitSequenceId()];
        if (storedUnitData) {
          if (storedUnitData.restorePoint) {
            this.pendingUnitData = {
              tag: this.itemPlayerSessionId,
              value: storedUnitData.restorePoint
            };
          } else {
            this.pendingUnitData = null;
          }

          if (storedUnitData.definition) {
            this.pendingUnitDefinition = {
              tag: this.itemPlayerSessionId,
              value: storedUnitData.definition
            };
          } else {
            this.pendingUnitDefinition = null;
          }
          this.tcs.responseStatus = storedUnitData.responsesCompleteState;
          this.tcs.presentationStatus = storedUnitData.presentationCompleteState;
        } else {
          this.tcs.responseStatus = '';
          this.tcs.presentationStatus = '';
        }

        if (this.postMessageTarget && !this.tcs.controllerSettings.reloadPlayer) {
          UnitHostComponent.sendConsoleMessage_ControllerInfoStart('reuse player');
          this.sendUnitStartCommand();
        } else {
          UnitHostComponent.sendConsoleMessage_ControllerInfoStart('create player');
          this.setupIFrameItemPlayer();
        }
      });
      // this.veronaSubscriptionService.vopStateChangedNotification
      //   .subscribe((message: VopStateChangedNotification) => {
      //     console.log('vopStateChangedNotification', message);
      //   });

      this.broadcastSubscription.add(this.broadcastService.messagesOfType('clearResponses').subscribe(message => {
        this.tcs.clearResponses();
      }));
    });
  }

  setupIFrameItemPlayer(): void {
    if (this.iFrameHostElement) {
      while (this.iFrameHostElement.lastChild) {
        this.iFrameHostElement.removeChild(this.iFrameHostElement.lastChild);
      }
      this.iFrameItemplayer = <HTMLIFrameElement>document.createElement('iframe');
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
    // current page is detected by disabled-attribute of page
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
      UnitHostComponent.sendConsoleMessage_ControllerInfo(`request page navigation to "${nextPageId}"`);
      if (this.postMessageTarget) {
        this.postMessageTarget.postMessage({
          type: 'vopPageNavigationCommand',
          sessionId: this.itemPlayerSessionId,
          target: nextPageId
        }, '*');
      }
    }
  }

  setupVopListener(): void {
    this.postMessageSubscription = this.tcs.postMessage$.subscribe((m: MessageEvent) => {
      const msgData = m.data;
      const msgType = msgData.type;
      const sessionId = msgData.sessionId;
      switch (msgType) {
        case 'vopReadyNotification': {
          UnitHostComponent.sendConsoleMessage_ControllerInfo('got vopReadyNotification');
          if (!m.data.metadata) {
            UnitHostComponent.sendConsoleMessage_ControllerWarn(' > player metadata missing');
          }
          this.postMessageTarget = m.source as Window;
          this.sendUnitStartCommand();
          break;
        }
        case 'vopStateChangedNotification':
          UnitHostComponent.sendConsoleMessage_ControllerInfo('got vopStateChangedNotification');
          if (sessionId && sessionId !== this.itemPlayerSessionId) {
            UnitHostComponent.sendConsoleMessage_ControllerError(' > invalid sessionId');
          }
          if (!msgData.timeStamp) UnitHostComponent.sendConsoleMessage_ControllerWarn(' > timestamp missing');
          if (sessionId === this.itemPlayerSessionId) {
            const playerState = msgData.playerState;
            if (playerState && playerState.validPages) {
              UnitHostComponent.sendConsoleMessage_ControllerInfo(
                ` > valid pages keys: [${Object.keys(playerState.validPages).join(', ')}]`
              );
              this.setPageList(
                playerState.validPages ? Object.keys(playerState.validPages) : [], playerState.currentPage
              );
            }
            const unitState = msgData.unitState;
            if (unitState) {
              const presentationProgress = unitState.presentationProgress;
              if (presentationProgress) {
                UnitHostComponent.sendConsoleMessage_ControllerInfo(' > new presentationProgress');
                this.tcs.unitList[this.tcs.currentUnitSequenceId()].presentationCompleteState =
                  presentationProgress;
                this.tcs.presentationStatus = presentationProgress;
              }
              const responseProgress = unitState.responseProgress;
              if (responseProgress) {
                UnitHostComponent.sendConsoleMessage_ControllerInfo(' > new responseProgress');
                this.tcs.unitList[this.tcs.currentUnitSequenceId()].responsesCompleteState = responseProgress;
                this.tcs.responseStatus = responseProgress;
              }
              const dataParts = unitState.dataParts;
              const unitStateDataType = unitState.unitStateDataType;
              if (dataParts as string) {
                UnitHostComponent.sendConsoleMessage_ControllerInfo(' > new responses');
                this.tcs.unitList[this.tcs.currentUnitSequenceId()].setResponses(
                  dataParts, msgData.timeStamp || Date.now()
                );
              }
              this.broadcastService.publish({
                type: 'response',
                unitNumber: this.tcs.fullPlayerConfig.unitNumber,
                payload: unitState,
                unitId: this.tcs.unitList[this.tcs.currentUnitSequenceId()].unitId
              });
            }
            if (msgData.log) {
              UnitHostComponent.sendConsoleMessage_ControllerInfo(` > ${msgData.log.length} new log entry/entries`);
            }
          }
          break;
        case 'vopUnitNavigationRequestedNotification':
          UnitHostComponent.sendConsoleMessage_ControllerInfo('got vopUnitNavigationRequestedNotification');
          if (sessionId && sessionId !== this.itemPlayerSessionId) {
            UnitHostComponent.sendConsoleMessage_ControllerError(' > invalid sessionId');
          }
          if (msgData.target) {
            UnitHostComponent
              .sendConsoleMessage_ControllerInfo(`got vopUnitNavigationRequestedNotification "${msgData.target}"`);
            if (this.tcs.checkUnitNavigationRequest(msgData.target)) {
              this.tcs.setUnitNavigationRequest(msgData.target);
            } else {
              this.sendDenyNavigation();
            }
          }
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
        case 'vopRuntimeErrorNotification':
          UnitHostComponent.sendConsoleMessage_ControllerInfo('got vopRuntimeErrorNotification');
          if (sessionId && sessionId !== this.itemPlayerSessionId) {
            UnitHostComponent.sendConsoleMessage_ControllerError(' > invalid sessionId');
          }
          if (msgData.code) UnitHostComponent.sendConsoleMessage_ControllerInfo(`ErrorCode: ${msgData.code}`);
          if (msgData.message) UnitHostComponent.sendConsoleMessage_ControllerInfo(`ErrorMessage: ${msgData.message}`);
          break;
        default:
          UnitHostComponent.sendConsoleMessage_ControllerWarn(`got unknown message "${msgType}" - ignore`);
          break;
      }
      this.cdRef.detectChanges();
    });
  }

  sendUnitStartCommand() {
    if (this.postMessageTarget) {
      let pendingUnitDef = '';
      if (this.pendingUnitDefinition !== null) {
        if (this.pendingUnitDefinition.tag === this.itemPlayerSessionId) {
          pendingUnitDef = this.pendingUnitDefinition.value;
          this.pendingUnitDefinition = null;
        }
      }
      let pendingUnitDataToRestore: DictionaryStringString = {};
      if (this.pendingUnitData && this.pendingUnitData.tag === this.itemPlayerSessionId) {
        pendingUnitDataToRestore = this.pendingUnitData.value;
        this.pendingUnitData = null;
      }
      UnitHostComponent.sendConsoleMessage_ControllerInfo('sending vopStartCommand');
      console.log('UnitDef', pendingUnitDef);
      console.log('UnitData', pendingUnitDataToRestore);
      console.log('PlayerConfig', this.tcs.fullPlayerConfig);
      this.postMessageTarget.postMessage({
        type: 'vopStartCommand',
        sessionId: this.itemPlayerSessionId,
        unitDefinition: pendingUnitDef,
        unitState: {
          dataParts: pendingUnitDataToRestore
        },
        playerConfig: this.tcs.fullPlayerConfig
      }, '*');
    }
  }

  sendDenyNavigation(): void {
    if (this.postMessageTarget) {
      const denyReasons: string[] = [];
      if (this.tcs.presentationStatus !== 'complete') denyReasons.push('presentationIncomplete');
      if (this.tcs.responseStatus !== 'complete') denyReasons.push('responsesIncomplete');
      UnitHostComponent.sendConsoleMessage_ControllerInfo('sending vopNavigationDeniedNotification');
      this.postMessageTarget.postMessage({
        type: 'vopNavigationDeniedNotification',
        sessionId: this.itemPlayerSessionId,
        reason: denyReasons
      }, '*');
    }
  }

  ngOnDestroy(): void {
    if (this.routingSubscription) this.routingSubscription.unsubscribe();
    if (this.postMessageSubscription) this.postMessageSubscription.unsubscribe();
  }

  private static getNewSessionId(): string {
    return Math.floor(Math.random() * 20000000 + 10000000).toString();
  }

  private static sendConsoleMessage_ControllerInfo(messageText: string): void {
    console.info(`%cController:%c ${messageText}`, 'color: green', 'color: black');
  }

  private static sendConsoleMessage_ControllerInfoStart(messageText: string): void {
    console.info(`%cController:%c ${messageText}`,
      'color: green; background-color: #fffa90',
      'color: black; background-color: #fffa90');
  }

  private static sendConsoleMessage_ControllerWarn(messageText: string): void {
    console.warn(`%c Controller: %c ${messageText}`, 'color: green', 'color: black');
  }

  static sendConsoleMessage_ControllerError(messageText: string): void {
    console.error(`%c Controller: %c ${messageText}`, 'background-color: #e57373', 'background-color: transparent');
  }

  showResponses() {
    this.showResponsesDialog.open(
      ShowResponsesDialogComponent, { width: '900px' }
    ).afterClosed();
  }
}
