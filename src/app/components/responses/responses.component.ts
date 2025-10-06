import {
  ChangeDetectorRef, Component, inject, OnDestroy, OnInit
} from '@angular/core';
import { Subscription } from 'rxjs';
import { MatButton } from '@angular/material/button';
import { MatDialogTitle } from '@angular/material/dialog';

import { TestControllerService } from '../../services/test-controller.service';
import { BroadcastService } from '../../services/broadcast.service';
import { ChunkData, UnitData } from '../../models/app.classes';

@Component({
  templateUrl: './responses.component.html',
  imports: [
    MatButton,
    MatDialogTitle
  ],
  standalone: true,
  styleUrls: ['./responses.component.scss']
})

export class ResponsesComponent implements OnInit, OnDestroy {
  // allResponses: [{ unitNumber: number, payload: UnitState, unitId: string, responses: any }] = [];
  allResponses: { [key: string]: ChunkData[] } = {};
  allKeys: string[] = [];
  hasSubForms = false;

  tcs = inject(TestControllerService);
  broadcastService = inject(BroadcastService);
  cdRef = inject(ChangeDetectorRef);
  subscription = new Subscription();

  ngOnInit(): void {
    this.subscription.add(this.broadcastService.messagesOfType('response').subscribe(message => {
      let responses;
      console.log('received message', message);
      if (message.payload) {
      // if (message.payload?.unitStateDataType?.includes('iqb-standard')) {
        if (message.unitSequenceId !== undefined) {
          let unit = this.tcs.unitList.find(u => u.sequenceId === message.unitSequenceId);
          if (!unit) {
            unit = new UnitData(message.unitId || '', message.unitSequenceId);
          }
          unit.presentationState = message.payload.presentationProgress || '';
          unit.responsesState = message.payload.responseProgress || '';
          if (message.payload.dataParts) {
            unit.setResponses(
              message.payload.dataParts, message.timeStamp as unknown as number || Date.now()
            );
          }
          console.log(this.tcs.unitList[message.unitSequenceId]);
        }
        /* if (message.payload?.dataParts && message.payload.dataParts['responses']) {
          responses = JSON.parse(message.payload.dataParts['responses']);
          if (responses && responses.length > 0) {
            if (this.allResponses?.some(unit => unit.unitNumber === message.unitNumber)) {
              const response = this.allResponses.find(unit => unit.unitNumber === message.unitNumber);
              if (response) {
                response.unitId = message.unitId || response.unitId;
                response.unitNumber = message.unitNumber || response.unitNumber;
                response.payload = message.payload || response.payload;
                response.responses = responses || response.responses;
              }
            } else {
              this.allResponses.push({
                unitNumber: message.unitNumber || -1,
                payload: message.payload || {},
                unitId: message.unitId || '',
                responses: responses
              });
            }
            this.allResponses.sort((a, b) => a.unitNumber - b.unitNumber);
          }
        } */
        this.allResponses = this.tcs.getAllResponses();
        console.log('allResponses', this.allResponses);
        this.allKeys = Object.keys(this.allResponses);
      } else {
        if (responses) {
          // TODO not iqb standard responses
        }
      }

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
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    this.allResponses = [];
  }

  protected readonly JSON = JSON;
}
