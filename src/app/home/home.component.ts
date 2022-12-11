import { Component } from '@angular/core';
import { TestControllerService } from '../test-controller.service';
import { EnabledNavigationTargetsConfig, UnitNavigationTarget, UploadFileType } from '../test-controller.interfaces';

interface NavigationTarget {
  name: UnitNavigationTarget;
  enable: boolean;
}

@Component({
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})

export class HomeComponent {
  uploadFileType = UploadFileType;
  enabledNavigationTargetsStates: { name: UnitNavigationTarget, enable: boolean }[];

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