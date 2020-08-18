import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UnitHostComponent } from './unit-host.component';

describe('UnitHostComponent', () => {
  let component: UnitHostComponent;
  let fixture: ComponentFixture<UnitHostComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UnitHostComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UnitHostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
