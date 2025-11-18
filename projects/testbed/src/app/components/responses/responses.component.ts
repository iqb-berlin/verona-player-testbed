import {
  ChangeDetectorRef, Component, inject, OnDestroy, OnInit
} from '@angular/core';
import { Subscription } from 'rxjs';
import { MatButton } from '@angular/material/button';

import { SharedParameter } from '../../../../../verona/src/lib/verona.interfaces';

import { TestControllerService } from '../../services/test-controller.service';
import { BroadcastService } from '../../services/broadcast.service';
import { LogService } from '../../services/log.service';
import { WidgetService } from '../../services/widget.service';

import { ChunkData, UnitData, WidgetResponseData } from '../../models/app.classes';
import { ResponseTableComponent } from './response-table.component';

@Component({
  templateUrl: './responses.component.html',
  imports: [
    MatButton,
    ResponseTableComponent
  ],
  standalone: true,
  styleUrls: ['./responses.component.scss']
})

export class ResponsesComponent implements OnInit, OnDestroy {
  // allResponses: [{ unitNumber: number, payload: UnitState, unitId: string, responses: any }] = [];
  allResponses: { [key: string]: ChunkData[] } = {};
  widgetResponses: WidgetResponseData | undefined;
  sharedParameters: SharedParameter[] = [];
  allParamKeys: string[] = [];
  allKeys: string[] = [];
  componentName = 'ResponsesComponent';

  tcs = inject(TestControllerService);
  ws = inject(WidgetService);
  broadcastService = inject(BroadcastService);
  cdRef = inject(ChangeDetectorRef);
  subscription = new Subscription();

  ngOnInit(): void {
    this.subscription.add(this.broadcastService.messagesOfType('response').subscribe(message => {
      LogService.info(this.componentName, ':', 'received message', message);
      if (message.payload) {
      // if (message.payload?.unitStateDataType?.includes('iqb-standard')) {
        // TODO check for unitStateDataType
        if (message.unitSequenceId !== undefined) {
          let unit = this.tcs.unitList.find(u => u.sequenceId === message.unitSequenceId);
          if (!unit) {
            unit = new UnitData(message.unitId || '', message.unitSequenceId);
            this.tcs.unitList.push(unit);
          }
          unit.presentationState = message.payload.presentationProgress || '';
          unit.responsesState = message.payload.responseProgress || '';
          if (message.payload.dataParts) {
            unit.setResponses(
              message.payload.dataParts, message.timeStamp as unknown as number || Date.now()
            );
          }
        }
        this.allResponses = this.tcs.getAllResponses();
        this.getAllKeys();
      }
      // TODO get rid of detectChanges(), use signal for all Responses instead
      this.cdRef.detectChanges();
    }));
    this.subscription.add(this.broadcastService.messagesOfType('clearResponses').subscribe(message => {
      LogService.info(this.componentName, ':', 'clearResponses message', message);
      this.tcs.clearResponses();
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      this.allResponses = [];
      this.getAllKeys();
      this.cdRef.detectChanges();
    }));
    this.subscription.add(this.broadcastService.messagesOfType('clearUnitList').subscribe(message => {
      LogService.info(this.componentName, ':', 'clearUnitList message', message);
      this.tcs.clearResponses();
      this.tcs.unitList = [];
      this.ws.clearResponses();
      this.cdRef.detectChanges();
    }));
    this.subscription.add(this.broadcastService.messagesOfType('sharedParametersChanged').subscribe(message => {
      LogService.info(this.componentName, ':', 'sharedParametersChanged message', message);
      if (message.sharedParameters) {
        this.tcs.addSharedParameters(message.sharedParameters);
        this.sharedParameters = this.tcs.sharedParameters;
        this.allParamKeys = Object.keys(this.sharedParameters);
      }
      this.cdRef.detectChanges();
    }));
    this.subscription.add(this.broadcastService.messagesOfType('widgetResponse').subscribe(message => {
      LogService.info(this.componentName, ':', 'widgetResponse message', message);
      if (message.state) {
        this.ws.state = message.state;
        if (!this.widgetResponses) this.clearWidgetResponses();
        if (this.widgetResponses) {
          this.widgetResponses.state = message.state;
          this.widgetResponses.parameters = message.parameters || {};
          this.widgetResponses.type = message.widgetType || '';
          this.widgetResponses.id = message.unitId || '';
        }
      }
      this.cdRef.detectChanges();
    }));
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  clearWidgetResponses() {
    this.widgetResponses = {
      id: '',
      type: '',
      raw: '',
      state: '',
      parameters: {}
    };
  }

  getAllKeys() {
    this.allKeys = Object.keys(this.allResponses);
  }

  clearResponses() {
    // extra function to prevent message loop
    // only for reset responses button in responses tab
    this.broadcastService.publish({
      type: 'clearResponses'
    });
    this.tcs.clearResponses();
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    this.allResponses = [];
    this.getAllKeys();
    this.widgetResponses = undefined;
  }
}
