import {
  ChangeDetectorRef,
  Component, inject, OnInit, signal
} from '@angular/core';
import { Router } from '@angular/router';

import { UnitNavigationTarget, WindowFocusState } from './interfaces/test-controller.interfaces';
import { TestControllerService } from './services/test-controller.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  standalone: false
})

export class AppComponent implements OnInit {
  title = 'Verona Player Testbed';
  version = '3.0';

  navigationEnabled = signal(true);
  unitNavigationTarget = UnitNavigationTarget;

  tcs = inject(TestControllerService);
  router = inject(Router);
  cdRef = inject(ChangeDetectorRef);

  ngOnInit(): void {
    window.addEventListener('message', (event: MessageEvent) => {
      const msgData = event.data;
      const msgType = msgData.type;
      if ((msgType !== undefined) && (msgType.slice(0, 2) === 'vo')) {
        this.tcs.postMessage$.next(event);
      }
    });

    window.addEventListener('blur', () => {
      this.tcs.windowFocusState$.next(WindowFocusState.UNKNOWN);
    });
    window.addEventListener('focus', () => {
      this.tcs.windowFocusState$.next(WindowFocusState.HOST);
    });
    window.addEventListener('unload', () => {
      this.tcs.windowFocusState$.next(WindowFocusState.UNKNOWN);
    });
  }

  activateRoute() {
    if (this.router.url.startsWith('/r')) {
      this.navigationEnabled.set(false);
      this.title = 'Responses';
      this.version = '';
    }
    this.cdRef.detectChanges();
  }
}
