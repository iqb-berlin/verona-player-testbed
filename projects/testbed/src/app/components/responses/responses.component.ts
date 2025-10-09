import {
  ChangeDetectorRef, Component, inject, OnDestroy, OnInit
} from '@angular/core';
import { Subscription } from 'rxjs';
import { MatButton } from '@angular/material/button';
import { MatDialogTitle } from '@angular/material/dialog';

import { TestControllerService } from '../../services/test-controller.service';
import { BroadcastService } from '../../services/broadcast.service';
import { LogService } from '../../services/log.service';

import { ChunkData, UnitData } from '../../models/app.classes';
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
  allKeys: string[] = [];
  componentName = 'ResponsesComponent';

  tcs = inject(TestControllerService);
  broadcastService = inject(BroadcastService);
  cdRef = inject(ChangeDetectorRef);
  subscription = new Subscription();

  ngOnInit(): void {
    this.subscription.add(this.broadcastService.messagesOfType('response').subscribe(message => {
      LogService.info(this.componentName, ':', 'received message', message);
      if (message.payload) {
      // if (message.payload?.unitStateDataType?.includes('iqb-standard')) {
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
        this.allKeys = Object.keys(this.allResponses);
      }
      this.cdRef.detectChanges();
    }));
    this.subscription.add(this.broadcastService.messagesOfType('clearResponses').subscribe(() => {
      this.tcs.clearResponses();
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      this.allResponses = [];
      this.cdRef.detectChanges();
    }));
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  clearResponses() {
    this.broadcastService.publish({
      type: 'clearResponses'
    });
    this.tcs.clearResponses();
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    this.allResponses = [];
  }

  protected readonly JSON = JSON;
}
