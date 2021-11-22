import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { MatSelectHarness } from '@angular/material/select/testing';
import { MatFormFieldHarness } from '@angular/material/form-field/testing';
import { MatCheckboxHarness } from '@angular/material/checkbox/testing';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatInputModule } from '@angular/material/input';
import { MatInputHarness } from '@angular/material/input/testing';
import { TestControllerService } from '../test-controller.service';
import { SettingsComponent } from './settings.component';
import { EnabledNavigationTargetsConfig } from '../test-controller.interfaces';

describe('SettingsComponent', () => {
  let fixture: ComponentFixture<SettingsComponent>;
  let tcsStub: Partial<TestControllerService>;
  let tcs;
  let loader: HarnessLoader;

  beforeEach(() => {
    tcsStub = {
      playerSupports() {
        return true;
      },
      playerConfig: {
        stateReportPolicy: 'eager',
        pagingMode: 'separate',
        logPolicy: 'rich',
        startPage: 1,
        enabledNavigationTargets: [...EnabledNavigationTargetsConfig],
        directDownloadUrl: 'https://raw.githubusercontent.com/iqb-berlin/verona-player-testbed/master'
      }
    };

    TestBed.configureTestingModule({
      declarations: [SettingsComponent],
      imports: [RouterTestingModule, NoopAnimationsModule, FormsModule,
        MatSelectModule, MatRadioModule, MatIconModule, MatCheckboxModule, MatInputModule],
      providers: [
        { provide: TestControllerService, useValue: tcsStub }
      ]
    });
    tcs = TestBed.inject(TestControllerService);
    fixture = TestBed.createComponent(SettingsComponent);
    loader = TestbedHarnessEnvironment.loader(fixture);
  });

  it('should create', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should render titles', () => {
    const nativeElement = fixture.nativeElement;
    const unitPanelTitleSelector = '.my-units > h2:nth-child(2)';
    const settingsPanelTitleSelector = '.mySettings > h2:nth-child(1)';
    expect(nativeElement.querySelector(unitPanelTitleSelector).textContent).toContain('Units');
    expect(nativeElement.querySelector(settingsPanelTitleSelector).textContent).toContain('Settings');
  });

  it('should update enabledNavigationTargets when using checkbox', async () => {
    const before: string[] = ['next', 'previous', 'first', 'last', 'end'];
    const after: string[] = ['next', 'previous', 'first', 'last'];
    expect(tcs.playerConfig.enabledNavigationTargets).toEqual(before);
    const endCheckBox = await loader.getHarness<MatCheckboxHarness>(MatCheckboxHarness.with({
      label: 'end'
    }));
    await endCheckBox.uncheck();
    expect(tcs.playerConfig.enabledNavigationTargets).toEqual(after);
  });

  it('should update startPage when enter a number', async () => {
    expect(tcs.playerConfig.startPage).toEqual(1);
    const startPageInput = await loader.getHarness<MatInputHarness>(MatInputHarness.with({
      placeholder: 'startPage'
    }));
    await startPageInput.setValue('2');
    expect(tcs.playerConfig.startPage).toEqual(2);
  });

  it('should update log policy when using select box', async () => {
    expect(tcs.playerConfig.logPolicy).toEqual('rich');
    const logPolicySelect = await (await loader.getHarness<MatFormFieldHarness>(MatFormFieldHarness.with({
      floatingLabelText: 'Logging policy'
    }))).getControl(MatSelectHarness);
    await logPolicySelect.clickOptions({ text: 'lean' });
    expect(tcs.playerConfig.logPolicy).toEqual('lean');
  });

  it('should update pagingMode when using select box', async () => {
    expect(tcs.playerConfig.pagingMode).toEqual('separate');
    const pagingModeSelect = await (await loader.getHarness<MatFormFieldHarness>(MatFormFieldHarness.with({
      floatingLabelText: 'pagingMode'
    }))).getControl(MatSelectHarness);
    await pagingModeSelect.clickOptions({ text: 'concat-scroll' });
    expect(tcs.playerConfig.pagingMode).toEqual('concat-scroll');
  });

  it('should update stateReportPolicy when using select box', async () => {
    expect(tcs.playerConfig.stateReportPolicy).toEqual('eager');
    const pagingModeSelect = await (await loader.getHarness<MatFormFieldHarness>(MatFormFieldHarness.with({
      floatingLabelText: 'stateReportPolicy'
    }))).getControl(MatSelectHarness);
    await pagingModeSelect.clickOptions({ text: 'on-demand' });
    expect(tcs.playerConfig.stateReportPolicy).toEqual('on-demand');
  });
});
