import { Component } from '@angular/core';
import { TestControllerService } from '../test-controller.service';
import { UploadFileType } from '../test-controller.interfaces';

@Component({
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})

export class HomeComponent {
  uploadFileType = UploadFileType;

  constructor(public tcs: TestControllerService) { }
}
