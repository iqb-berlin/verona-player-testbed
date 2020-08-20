import {TestControllerService} from '../test-controller.service';
import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot} from '@angular/router';
import {Observable} from 'rxjs';
import {MatSnackBar} from '@angular/material/snack-bar';

@Injectable()
export class UnitActivateGuard implements CanActivate {
  constructor(
    private tcs: TestControllerService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {

    const targetUnitSequenceId: number = Number(next.params['u']);
    if (this.tcs.unitList.length > 0 && targetUnitSequenceId >= 0 && targetUnitSequenceId < this.tcs.unitList.length) {
      return true
    } else {
      this.snackBar.open('Ziel-Unit ungültig.','', {duration: 3000});
      this.router.navigate(['/']);
      return false
    }
  }
}
