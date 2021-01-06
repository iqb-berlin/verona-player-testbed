import {
  ComponentFixture, fakeAsync, TestBed, tick
} from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';
import { MatTooltipModule } from '@angular/material/tooltip';

import { UnitHostComponent } from './unit-host.component';
import { TestControllerService } from '../test-controller.service';
import { UnitData } from '../app.classes';

describe('UnitHostComponent', () => {
  let tcs: TestControllerService;
  let component: UnitHostComponent;
  let fixture: ComponentFixture<UnitHostComponent>;
  const tcsStub: Partial<TestControllerService> = {
    unitList: [
      new UnitData('unit1', 0),
      new UnitData('unit2', 1),
      new UnitData('unit3', 2)
    ],
    postMessage$: new Subject<MessageEvent>()
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, MatTooltipModule],
      declarations: [UnitHostComponent],
      providers: [
        { provide: TestControllerService, useValue: tcsStub },
        { provide: ActivatedRoute, useValue: { params: of({ u: '2' }) } }
      ]
    });
    fixture = TestBed.createComponent(UnitHostComponent);
    component = fixture.componentInstance;
    tcs = TestBed.inject(TestControllerService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
    expect(tcs).toBeTruthy();
  });

  it('should init vars', fakeAsync(() => {
    component.ngOnInit();
    tick();
    expect(tcs.currentUnitSequenceId).toEqual(2);
    expect(component.unitTitle).toEqual('unit3');
  }));
});
