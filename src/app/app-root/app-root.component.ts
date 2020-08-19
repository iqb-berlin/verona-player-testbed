import { Component, OnInit } from '@angular/core';
import {TestControllerService} from "../test-controller.service";
import {UploadFileType} from "../test-controller.interfaces";

@Component({
  selector: 'app-app-root',
  templateUrl: './app-root.component.html',
  styleUrls: ['./app-root.component.scss']
})
export class AppRootComponent implements OnInit {
  uploadFileType = UploadFileType;

  constructor(
    public tcs: TestControllerService
  ) { }

  ngOnInit(): void {
  }

}
