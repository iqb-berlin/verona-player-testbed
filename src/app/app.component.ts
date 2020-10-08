import {
  Component, ElementRef, OnInit, ViewChild
} from '@angular/core';
import { UnitNavigationTarget } from './app.classes';
import { TestControllerService } from './test-controller.service';
import { WindowFocusState } from './test-controller.interfaces';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  @ViewChild('fileSelect', { read: ElementRef }) fileSelectElement: ElementRef;

  unitNavigationTarget = UnitNavigationTarget;

  constructor(
    public tcs: TestControllerService
  ) {}

  ngOnInit(): void {
    setTimeout(() => {
      this.tcs.fileSelectElement = this.fileSelectElement;
    });
    window.addEventListener('message', (event: MessageEvent) => {
      const msgData = event.data;
      const msgType = msgData.type;
      console.log(msgType);
      if ((msgType !== undefined) && (msgType !== null)) {
        if (msgType.substr(0, 2) === 'vo') {
          this.tcs.postMessage$.next(event);
        }
      }
    });

    let hidden = '';
    let visibilityChange = '';
    if (typeof document.hidden !== 'undefined') { // Opera 12.10 and Firefox 18 and later support
      hidden = 'hidden';
      visibilityChange = 'visibilitychange';
    } else if (typeof document.msHidden !== 'undefined') {
      hidden = 'msHidden';
      visibilityChange = 'msvisibilitychange';
    } else if (typeof document.mozHidden !== 'undefined') {
      hidden = 'mozHidden';
      visibilityChange = 'mozHidden';
    } else if (typeof document.webkitHidden !== 'undefined') {
      hidden = 'webkitHidden';
      visibilityChange = 'webkitvisibilitychange';
    }
    if (hidden && visibilityChange) {
      document.addEventListener(visibilityChange, () => {
        if (document[hidden]) {
          this.tcs.windowFocusState$.next(WindowFocusState.UNKNOWN);
        }
      }, false);
    }
    window.addEventListener('blur', () => {
      if (document.hasFocus()) {
        this.tcs.windowFocusState$.next(WindowFocusState.HOST);
      } else {
        this.tcs.windowFocusState$.next(WindowFocusState.UNKNOWN);
      }
    });
    window.addEventListener('focus', () => {
      if (document.hasFocus()) {
        this.tcs.windowFocusState$.next(WindowFocusState.HOST);
      } else {
        this.tcs.windowFocusState$.next(WindowFocusState.UNKNOWN);
      }
    });
    window.addEventListener('unload', () => {
      if (document[hidden]) {
        this.tcs.windowFocusState$.next(WindowFocusState.UNKNOWN);
      }
    });
  }
}
