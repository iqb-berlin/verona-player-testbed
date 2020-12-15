import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot
} from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable } from 'rxjs';
import { TestControllerService } from '../test-controller.service';

@Injectable()
export class UnitActivateGuard implements CanActivate {
  constructor(
    private tcs: TestControllerService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  canActivate(next: ActivatedRouteSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    const targetUnitSequenceId = Number(next.params.u);
    if (this.tcs.unitList.length > 0 && targetUnitSequenceId >= 0 &&
        targetUnitSequenceId < this.tcs.unitList.length) {
      return true;
    }
    this.snackBar.open('Ziel-Unit ungültig.', '', { duration: 3000 });
    this.router.navigate(['/']);
    return false;
  }
}
