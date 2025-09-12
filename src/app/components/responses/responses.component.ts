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
import { UnitState } from '../../interfaces/verona.interfaces';

@Component({
  templateUrl: './responses.component.html',
  imports: [
    MatButton,
    MatDialogActions,
    MatDialogContent,
    MatDialogTitle
  ],
  styleUrls: ['./responses.component.scss']
})

export class ResponsesComponent implements OnInit, OnDestroy {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  allResponses: [{ unitNumber: number, payload: UnitState, unitId: string, responses: any }] = [];
  hasSubForms = false;

  tcs = inject(TestControllerService);
  broadCastService = inject(BroadcastService);
  cdRef = inject(ChangeDetectorRef);
  subscription = new Subscription();

  ngOnInit(): void {
    this.subscription.add(this.broadCastService.messagesOfType('response').subscribe(message => {
      let responses;
      if (message.payload.dataParts && message.payload.dataParts['responses']) {
        responses = JSON.parse(message.payload.dataParts['responses']);
      }
      if (this.allResponses?.some(unit => unit.unitNumber === message.unitNumber)) {
        const response = this.allResponses.find(unit => unit.unitNumber === message.unitNumber);
        if (response) {
          response.unitId = message.unitId;
          response.unitNumber = message.unitNumber;
          response.payload = message.payload;
          response.responses = responses;
        }
      } else {
        this.allResponses.push({
          unitNumber: message.unitNumber,
          payload: message.payload,
          unitId: message.unitId,
          responses: responses
        });
      }
      this.allResponses.sort((a, b) => a.unitNumber - b.unitNumber);
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
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    this.allResponses = [];
  }

  protected readonly JSON = JSON;
}
