import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { MatRadioButtonHarness } from '@angular/material/radio/testing';
import { MatSelectHarness } from '@angular/material/select/testing';
import { MatFormFieldHarness } from '@angular/material/form-field/testing';
import { SettingsComponent } from './settings.component';
import { TestControllerService } from '../test-controller.service';
import { VeronaInterfacePlayerVersion } from '../app.classes';

describe('SettingsComponent', () => {
  let fixture: ComponentFixture<SettingsComponent>;
  let tcsStub: Partial<TestControllerService>;
  let tcs;
  let loader: HarnessLoader;

  beforeEach(() => {
    tcsStub = {
      veronaInterfacePlayerVersion: VeronaInterfacePlayerVersion.v2_0,
      notSupportedApiFeatures: [],
      playerSupports() {
        return true;
      },
      playerConfig: {
        stateReportPolicy: 'eager',
        pagingMode: 'separate',
        logPolicy: 'rich'
      }
    };

    TestBed.configureTestingModule({
      declarations: [SettingsComponent],
      imports: [RouterTestingModule, NoopAnimationsModule, FormsModule,
        MatSelectModule, MatRadioModule, MatIconModule],
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

  it('should update version when using radio button', async () => {
    expect(tcs.veronaInterfacePlayerVersion).toEqual(VeronaInterfacePlayerVersion.v2_0);
    const v1RadioButton = await loader.getHarness<MatRadioButtonHarness>(MatRadioButtonHarness.with({
      label: 'v1x'
    }));
    await v1RadioButton.check();
    expect(tcs.veronaInterfacePlayerVersion).toEqual(VeronaInterfacePlayerVersion.v1x);
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
