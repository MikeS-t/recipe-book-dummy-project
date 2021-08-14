import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { map, switchMap, tap } from "rxjs/operators";
import { createSelector, select, Store } from "@ngrx/store";

import { Ingredient } from "./ingredient.model";
import * as ShoppingListActions from "./shopping-list.actions";
import * as fromApp from "../app.reducer";

@Injectable()
export class ShoppingListEffects {

  constructor(
    private actions$: Actions,
    private store: Store<fromApp.AppState>,
  ) {}

  saveIngredients$ = createEffect(() => this.actions$.pipe(
    ofType(
      ShoppingListActions.ADD_INGREDIENT,
      ShoppingListActions.ADD_INGREDIENTS,
      ShoppingListActions.UPDATE_INGREDIENT,
      ShoppingListActions.DELETE_INGREDIENT,
      ShoppingListActions.DELETE_INGREDIENTS
    ),
    switchMap(() => {
      return this.store.pipe(
        select(
          createSelector(
            (shoppingListState: fromApp.AppState) => shoppingListState.shoppingList.ingredients,
            (shoppingListState: Ingredient []) => shoppingListState
          )
        )
      )
    }),
    tap((shoppingListState: Ingredient []) => {
      if(shoppingListState.length) {
        localStorage.setItem('shoppingListData', JSON.stringify(shoppingListState));
      } else {
        localStorage.removeItem('shoppingListData');
      }
    })), { dispatch: false });

  autoLoadIgreadients$ = createEffect(() => this.actions$.pipe(
    ofType(ShoppingListActions.AUTO_LOAD_INGREDIENTS),
    map(() => {
      const loadedIngredients: Ingredient [] = JSON.parse(localStorage.getItem('shoppingListData'));
      if(loadedIngredients) {
        return new ShoppingListActions.AddIngredients({ ingredients: loadedIngredients });
      } else {
        return { type: 'NO_EFFECT' };
      }
    })
  ));

}
