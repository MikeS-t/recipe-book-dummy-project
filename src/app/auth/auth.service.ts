import { Injectable } from "@angular/core";
import { Store } from "@ngrx/store";

import * as fromApp from "../app.reducer";
import * as AuthActions from "./auth.actions";

@Injectable({ providedIn: 'root' })
export class AuthService {
  constructor(
    private store: Store<fromApp.AppState>
  ) {}

  expirationTimer: any;

  setLogOutTimer(expiresIn: number) {
    this.expirationTimer = setTimeout(() => {
      this.store.dispatch(new AuthActions.LogOut());
    }, expiresIn)
  }

  clearLogOutTimer() {
    if (this.expirationTimer) {
      clearTimeout(this.expirationTimer);
      this.expirationTimer = null;
    }
  }
}
