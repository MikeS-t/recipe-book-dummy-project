import { ActionReducerMap } from '@ngrx/store';

import * as fromRecipes from './recipes/recipes.reducer';
import * as fromShoppingList from './shopping-list/shopping-list.reducer';
import * as fromAuth from './auth/auth.reducer';

export interface AppState {
  recipes: fromRecipes.State,
  shoppingList: fromShoppingList.State,
  auth: fromAuth.State
}

export const appReducer: ActionReducerMap<AppState> = {
  recipes: fromRecipes.recipesReducer,
  shoppingList: fromShoppingList.shoppingListReducer,
  auth: fromAuth.authReducer
};
