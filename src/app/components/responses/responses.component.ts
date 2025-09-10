import {
  Component, inject, OnDestroy, OnInit
} from '@angular/core';
import { Subscription } from 'rxjs';

import { TestControllerService } from '../../services/test-controller.service';
import { BroadcastService } from '../../services/broadcast.service';

@Component({
  templateUrl: './responses.component.html',
  styleUrls: ['./responses.component.scss']
})

export class ResponsesComponent implements OnInit, OnDestroy {
  tcs = inject(TestControllerService);
  broadCastService = inject(BroadcastService);
  subscription = new Subscription();

  ngOnInit(): void {
    this.subscription.add(this.broadCastService.messagesOfType('response').subscribe(message => {
      console.log('received message', message);
    }));
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
