import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DenyNavigationComponent } from './deny-navigation.component';
import { AppModule } from '../../app.module';

describe('DenyNavigationComponent', () => {
  let component: DenyNavigationComponent;
  let fixture: ComponentFixture<DenyNavigationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppModule],
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
