import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {UnitNavigationTarget} from "./app.classes";
import {TestControllerService} from "./test-controller.service";
import {UploadFileType} from "./test-controller.interfaces";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  @ViewChild("fileSelect", {read: ElementRef}) fileSelectElement: ElementRef;
  unitPrevEnabled = false;
  unitNextEnabled = false;
  unitNavigationTarget = UnitNavigationTarget;

  constructor (
    public tcs: TestControllerService,
  ) {}

  ngOnInit() {
    setTimeout(() => {
      this.tcs.fileSelectElement = this.fileSelectElement;
    })
    window.addEventListener('message', (event: MessageEvent) => {
      const msgData = event.data;
      const msgType = msgData['type'];
      if ((msgType !== undefined) && (msgType !== null)) {
        if (msgType.substr(0, 3) === 'vo.') {
          this.tcs.postMessage$.next(event);
        }
      }
    });
  }

  setUnitNavigationRequest(target: UnitNavigationTarget) {
    console.warn('TODO: setUnitNavigationRequest');
  }

  uploadPlayer() {
    this.tcs.setUploadFileRequest(UploadFileType.PLAYER);
  }
  uploadUnit() {
    this.tcs.setUploadFileRequest(UploadFileType.UNIT);
  }

}
