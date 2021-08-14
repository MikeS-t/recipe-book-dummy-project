import { Component, OnInit } from '@angular/core';
import { select, Store } from "@ngrx/store";
import { Observable } from "rxjs/internal/Observable";

import * as fromApp from "../../app.reducer";
import * as AuthActions from "../../auth/auth.actions";
import { userSelector } from "../selectors";
import { User } from "../../auth/user.model";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html'
})
export class HeaderComponent implements OnInit {
  user$: Observable<User>;
  constructor(
    private store: Store<fromApp.AppState>
  ) {}

  ngOnInit() {
    this.user$ = this.store.pipe(select(userSelector));
  }

  onLogout() {
    this.store.dispatch(new AuthActions.LogOut());
  }
}
