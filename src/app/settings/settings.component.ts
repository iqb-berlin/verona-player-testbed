import { Component } from '@angular/core';
import { TestControllerService } from '../test-controller.service';
import { EnabledNavigationTargetsConfig, UnitNavigationTarget, UploadFileType } from '../test-controller.interfaces';
import { VeronaModuleMetadataVersions } from '../metadata/verona.interfaces';

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
  enabledNavigationTargetsStates: { name: UnitNavigationTarget, enable: boolean }[];
  VeronaModuleMetadataVersions = VeronaModuleMetadataVersions;

  constructor(public tcs: TestControllerService) {
    this.enabledNavigationTargetsStates =
      [...EnabledNavigationTargetsConfig].map((i): NavigationTarget => (
        {
          name: i,
          enable: tcs.playerConfig.enabledNavigationTargets.indexOf(i) > -1
        }));
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
