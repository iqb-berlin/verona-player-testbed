import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VeronaComponent } from './verona.component';

describe('VeronaComponent', () => {
  let component: VeronaComponent;
  let fixture: ComponentFixture<VeronaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VeronaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VeronaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
