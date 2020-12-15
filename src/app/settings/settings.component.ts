import { Component } from '@angular/core';
import { MatRadioChange } from '@angular/material/radio';
import { TestControllerService } from '../test-controller.service';
import { UploadFileType } from '../test-controller.interfaces';
import { VeronaInterfacePlayerVersion } from '../app.classes';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent {
  uploadFileType = UploadFileType;
  versions = Object.values(VeronaInterfacePlayerVersion).filter((x) => typeof x === 'string');
  selectedVersion: string = VeronaInterfacePlayerVersion[this.tcs.veronaInterfacePlayerVersion];

  constructor(
    public tcs: TestControllerService
  ) { }

  updateVersion(value: string): void {
    this.tcs.veronaInterfacePlayerVersion = Number(VeronaInterfacePlayerVersion[value]);
  }
}
