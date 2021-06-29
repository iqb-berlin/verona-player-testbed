import {
  Component, OnInit
} from '@angular/core';
import { UnitNavigationTarget, WindowFocusState } from './test-controller.interfaces';
import { TestControllerService } from './test-controller.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'IQB Verona Player Testbed';
  unitNavigationTarget = UnitNavigationTarget;

  constructor(public tcs: TestControllerService) { }

  ngOnInit(): void {
    window.addEventListener('message', (event: MessageEvent) => {
      const msgData = event.data;
      const msgType = msgData.type;
      if ((msgType !== undefined) && (msgType.substr(0, 2) === 'vo')) {
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
}
