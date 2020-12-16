import { TestBed, ComponentFixture } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AppComponent } from './app.component';
import { TestControllerService } from './test-controller.service';
import { WindowFocusState } from './test-controller.interfaces';

describe('AppComponent', () => {
  let fixture: ComponentFixture<AppComponent>;
  let component: AppComponent;
  let tcs: TestControllerService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      declarations: [AppComponent],
      providers: [TestControllerService]
    });
    fixture = TestBed.createComponent(AppComponent);
    tcs = TestBed.inject(TestControllerService);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the app and add listeners', async () => {
    expect(component).toBeTruthy();
  });

  it('should have and render title \'IQB Verona Player Testbed\'', () => {
    expect(component.title).toEqual('IQB Verona Player Testbed');
    const compiled = fixture.nativeElement;
    expect(compiled.querySelector('.title').textContent).toContain('IQB Verona Player Testbed');
  });

  it('should create event and focus listeners', () => {
    spyOn(window, 'addEventListener');
    component.ngOnInit();
    expect(window.addEventListener).toHaveBeenCalled();
  });

  it('pass on fired window focus events', () => {
    spyOn(tcs.windowFocusState$, 'next');
    window.dispatchEvent(new Event('focus'));
    expect(tcs.windowFocusState$.next).toHaveBeenCalledWith(WindowFocusState.HOST);
    window.dispatchEvent(new Event('unload'));
    expect(tcs.windowFocusState$.next).toHaveBeenCalledWith(WindowFocusState.UNKNOWN);
    window.dispatchEvent(new Event('blur'));
    expect(tcs.windowFocusState$.next).toHaveBeenCalledWith(WindowFocusState.UNKNOWN);
  });

  it('should handle MessageEvents', () => {
    spyOn(tcs.postMessage$, 'next');
    const testEvent: MessageEvent = new MessageEvent('message', {
      data: {
        type: 'vopReadyNotification',
        apiVersion: '2'
      }
    });
    window.dispatchEvent(testEvent);
    expect(tcs.postMessage$.next).toHaveBeenCalledWith(testEvent);

    const faultyTestEvent: MessageEvent = new MessageEvent('message', {
      data: {
        type: 'murks',
        apiVersion: '2'
      }
    });
    window.dispatchEvent(faultyTestEvent);
    expect((tcs.postMessage$.next as jasmine.Spy).calls.count()).toBe(1);
  });
});
