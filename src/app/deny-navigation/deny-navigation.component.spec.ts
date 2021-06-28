import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { ReactiveFormsModule } from '@angular/forms';
import { DenyNavigationComponent } from './deny-navigation.component';

describe('DenyNavigationComponent', () => {
  let component: DenyNavigationComponent;
  let fixture: ComponentFixture<DenyNavigationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MatCheckboxModule, MatButtonModule, ReactiveFormsModule],
      declarations: [DenyNavigationComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DenyNavigationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
