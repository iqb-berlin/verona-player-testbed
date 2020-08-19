import { TestBed, inject } from '@angular/core/testing';

import { UnitActivateGuard } from './unit-route-guards';
import {HttpClientModule} from "@angular/common/http";
import {MatDialogModule} from "@angular/material/dialog";
import {MatSnackBarModule} from "@angular/material/snack-bar";
import {TestControllerService} from "../test-controller.service";

describe('UnitActivateGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [UnitActivateGuard, TestControllerService],
      imports: [HttpClientModule, MatDialogModule, MatSnackBarModule]
    });
  });

  it('should ...', inject([UnitActivateGuard], (guard: UnitActivateGuard) => {
    expect(guard).toBeTruthy();
  }));
});
