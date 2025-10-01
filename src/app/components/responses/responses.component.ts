import {
  ChangeDetectorRef, Component, inject, OnDestroy, OnInit
} from '@angular/core';
import { Subscription } from 'rxjs';
import { MatButton } from '@angular/material/button';
import {
  MatDialogActions, MatDialogContent, MatDialogTitle
} from '@angular/material/dialog';

import { TestControllerService } from '../../services/test-controller.service';
import { BroadcastService } from '../../services/broadcast.service';
import { UnitState } from '../../../../projects/verona/src/lib/verona.interfaces';

@Component({
  templateUrl: './responses.component.html',
  imports: [
    MatButton,
    MatDialogActions,
    MatDialogContent,
    MatDialogTitle
  ],
  standalone: true,
  styleUrls: ['./responses.component.scss']
})

export class ResponsesComponent implements OnInit, OnDestroy {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  allResponses: [{ unitNumber: number, payload: UnitState, unitId: string, responses: any }] = [];
  hasSubForms = false;

  tcs = inject(TestControllerService);
  broadcastService = inject(BroadcastService);
  cdRef = inject(ChangeDetectorRef);
  subscription = new Subscription();

  ngOnInit(): void {
    this.subscription.add(this.broadcastService.messagesOfType('response').subscribe(message => {
      let responses = undefined;
      if (message.payload?.unitStateDataType?.includes('iqb-standard')) {
        if (message.payload?.dataParts && message.payload.dataParts['responses']) {
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
        }
      } else {
        responses
        if (responses) {}
      }
      this.cdRef.detectChanges();
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      console.log('received message', this.allResponses);
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
