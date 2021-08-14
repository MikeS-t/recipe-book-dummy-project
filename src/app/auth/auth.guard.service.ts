import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from "@angular/router";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs/internal/Observable";
import { map, take } from "rxjs/operators";
import { select, Store } from "@ngrx/store";

import * as fromApp from "../app.reducer";
import { userSelector } from "../shared/selectors";

@Injectable({ providedIn: 'root' })
export class AuthGuardService implements CanActivate {
  constructor(
    private store: Store<fromApp.AppState>,
    private router: Router
  ) {}

  canActivate(route: ActivatedRouteSnapshot, router: RouterStateSnapshot):
    boolean | UrlTree | Promise<boolean | UrlTree> | Observable<boolean | UrlTree> {
    return this.store.pipe(
      select(userSelector),
      take(1),
      map(user => !!user ? true : this.router.createUrlTree(['/auth']))
    );
  }
}
