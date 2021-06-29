import { Component } from '@angular/core';
import { TestControllerService } from '../test-controller.service';
import { EnabledNavigationTargetsConfig, UnitNavigationTarget, UploadFileType } from '../test-controller.interfaces';
import { VeronaInterfacePlayerVersion } from '../app.classes';

interface NavigationTarget {
  name: UnitNavigationTarget;
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
  enabledNavigationTargetsStates: { name: UnitNavigationTarget, enable: boolean }[];

  constructor(public tcs: TestControllerService) {
    this.enabledNavigationTargetsStates =
      [...EnabledNavigationTargetsConfig].map((i): NavigationTarget => (
        {
          name: i,
          enable: tcs.playerConfig.enabledNavigationTargets.indexOf(i) > -1
        }));
  }

  updateVersion(value: string): void {
    this.tcs.veronaInterfacePlayerVersion = Number(VeronaInterfacePlayerVersion[value]);
  }

  onCheckboxChange(): void {
    this.tcs.playerConfig.enabledNavigationTargets =
      this.enabledNavigationTargetsStates
        .filter(
          (i: NavigationTarget): boolean => i.enable
        )
        .map((i: NavigationTarget): UnitNavigationTarget => i.name);
  }
}
