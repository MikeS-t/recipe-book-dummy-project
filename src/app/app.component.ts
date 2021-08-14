import { Component, OnInit } from '@angular/core';
import { Store } from "@ngrx/store";

import * as fromApp from "./app.reducer";
import * as AuthActions from "./auth/auth.actions";
import * as ShoppingListActions from "./shopping-list/shopping-list.actions";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent implements OnInit {
  constructor(
    private store: Store<fromApp.AppState>
  ) {}

  ngOnInit() {
    this.store.dispatch(new AuthActions.AutoLogIn());
    this.store.dispatch(new ShoppingListActions.AutoLoadIngredients());
  }
}
