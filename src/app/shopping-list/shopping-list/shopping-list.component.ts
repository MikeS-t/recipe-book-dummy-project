import { Component, OnInit } from '@angular/core';
import { select, Store } from "@ngrx/store";
import { Observable } from "rxjs/internal/Observable";

import * as ShoppingListActions from "../shopping-list.actions";
import * as fromApp from "../../app.reducer";
import { shoppingStateSelector } from "../../shared/selectors";
import { State as ShoppingState } from "../shopping-list.reducer";

@Component({
  selector: 'app-shopping-list',
  templateUrl: './shopping-list.component.html'
})
export class ShoppingListComponent implements OnInit {
  shoppingState$: Observable<ShoppingState>;

  constructor(private store: Store<fromApp.AppState>) {}

  ngOnInit() {
    this.shoppingState$ = this.store.pipe(select(shoppingStateSelector));
  }

  onEditIngredient(index: number) {
    this.store.dispatch(new ShoppingListActions.StartEdit({ ingredientIndex: index }));
  }
}
