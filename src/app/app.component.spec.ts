import { TestBed, ComponentFixture, async } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AppComponent } from './app.component';

describe('AppComponent', () => {
  let fixture: ComponentFixture<AppComponent>;
  let component: AppComponent;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      declarations: [AppComponent]
    }).compileComponents();
    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
  }));

  it('should create the app', async () => {
    expect(component).toBeTruthy();
  });

  it('should have as title \'IQB Verona Player Testbed\'', () => {
    expect(component.title).toEqual('IQB Verona Player Testbed');
  });

  it('should render title', () => {
    fixture.detectChanges();
    const compiled = fixture.nativeElement;
    expect(compiled.querySelector('.title').textContent).toContain('IQB Verona Player Testbed');
  });

  it('should create focus listeners', () => {
    spyOn(window, 'addEventListener');
    component.ngOnInit();
    expect(window.addEventListener).toHaveBeenCalled();
  });
});
