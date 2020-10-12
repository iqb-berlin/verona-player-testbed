import { Component } from '@angular/core';
import { TestControllerService } from '../test-controller.service';
import { UploadFileType } from '../test-controller.interfaces';
import { VeronaInterfacePlayerVersion } from '../app.classes';

@Component({
  selector: 'app-app-root',
  templateUrl: './app-root.component.html',
  styleUrls: ['./app-root.component.scss']
})
export class AppRootComponent {
  uploadFileType = UploadFileType;
  test = false;

  public get isVersion2(): boolean {
    return this.tcs.veronaInterfacePlayerVersion === VeronaInterfacePlayerVersion.v2_0;
  }

  public set isVersion2(is2: boolean) {
    if (is2) {
      this.tcs.veronaInterfacePlayerVersion = VeronaInterfacePlayerVersion.v2_0;
    } else {
      this.tcs.veronaInterfacePlayerVersion = VeronaInterfacePlayerVersion.v1x;
    }
  }

  constructor(
    public tcs: TestControllerService
  ) { }
}
