import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgForm } from "@angular/forms";
import { select, Store } from "@ngrx/store";

import * as fromApp from "../../app.reducer";
import * as AuthActions from "../auth.actions";
import { authStateSelector } from "../../shared/selectors";
import { State as AuthState }  from "../auth.reducer";
import { Observable } from "rxjs/internal/Observable";

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html'
})
export class AuthComponent implements OnInit, OnDestroy {
  isLoginMode = true;
  authState$: Observable<AuthState>;

  constructor(private store: Store<fromApp.AppState>) {}

  ngOnInit() {
    this.authState$ = this.store.pipe(select(authStateSelector));
  }

  onSwitchLoginMode() {
    this.isLoginMode = !this.isLoginMode;
    this.store.dispatch(new AuthActions.ClearError());
  }

  onSubmit(form: NgForm) {
    if (form.valid) {
      const email = form.value.email;
      const password = form.value.password;


      if (this.isLoginMode) {
        this.store.dispatch(new AuthActions.LogInStart({email, password}));
      } else {
        this.store.dispatch(new AuthActions.SignUpStart({email, password}));
      }
    }
  }

  ngOnDestroy() {
    this.store.dispatch(new AuthActions.ClearError());
  }
}
