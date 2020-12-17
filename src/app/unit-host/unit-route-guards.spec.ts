import { TestBed } from '@angular/core/testing';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { UnitActivateGuard } from './unit-route-guards';

import { TestControllerService } from '../test-controller.service';

describe('UnitActivateGuard', () => {
  let guard: UnitActivateGuard;
  let tcs: TestControllerService;
  const tcsStub = {
    unitList: []
  };
  let route: ActivatedRouteSnapshot;
  const routerSpy = {
    navigate: jasmine.createSpy('navigate')
  };
  const snackBarSpy = {
    open: jasmine.createSpy()
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [MatSnackBarModule, RouterTestingModule, NoopAnimationsModule],
      providers: [
        UnitActivateGuard,
        { provide: TestControllerService, useValue: tcsStub },
        { provide: Router, useValue: routerSpy },
        { provide: MatSnackBar, useValue: snackBarSpy }
      ]
    });
    guard = TestBed.inject(UnitActivateGuard);
    tcs = TestBed.inject(TestControllerService);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });

  it('do nothing on negative unit param', () => {
    route = {
      params: { u: '-1' }
    } as unknown as ActivatedRouteSnapshot;
    expect(guard.canActivate(route)).toBeFalsy();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/']);
    expect(snackBarSpy.open).toHaveBeenCalledWith('Ziel-Unit ungültig.', '', { duration: 3000 });
  });

  it('navigate only if there are units to navigate to', () => {
    route = { params: { u: '1' } } as unknown as ActivatedRouteSnapshot;
    expect(guard.canActivate(route)).toBeFalsy();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/']);

    tcs.unitList = [undefined, undefined];
    expect(guard.canActivate(route)).toBeTruthy();

    route = { params: { u: '3' } } as unknown as ActivatedRouteSnapshot;
    expect(guard.canActivate(route)).toBeFalsy();
  });
});
