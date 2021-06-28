import { Component } from '@angular/core';
import { TestControllerService } from '../test-controller.service';
import { UploadFileType } from '../test-controller.interfaces';
import { VeronaInterfacePlayerVersion } from '../app.classes';

interface NavigationTarget {
  name: string;
  enable: boolean;
}

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})

export class SettingsComponent {
  uploadFileType = UploadFileType;
  versions = Object.values(VeronaInterfacePlayerVersion).filter(x => typeof x === 'string');
  selectedVersion: string = VeronaInterfacePlayerVersion[this.tcs.veronaInterfacePlayerVersion];
  enabledNavigationTargets: { name: string, enable: boolean }[];

  constructor(public tcs: TestControllerService) {
    this.enabledNavigationTargets = tcs.playerConfig.enabledNavigationTargets
      .map((i:string): NavigationTarget => ({ name: i, enable: true }));
  }

  updateVersion(value: string): void {
    this.tcs.veronaInterfacePlayerVersion = Number(VeronaInterfacePlayerVersion[value]);
  }

  onCheckboxChange(): void {
    this.tcs.playerConfig.enabledNavigationTargets =
      this.enabledNavigationTargets
        .filter(
          (i: NavigationTarget): boolean => i.enable
        )
        .map((i: NavigationTarget): string => i.name);
  }
}
