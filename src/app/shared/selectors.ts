import * as fromApp from "../app.reducer";
import { createSelector } from "@ngrx/store";

export const recipesSelector = createSelector(
  (recipesState: fromApp.AppState) => recipesState.recipes.recipes,
  recipes => recipes
);

export const userSelector = createSelector(
  (authState: fromApp.AppState) => authState.auth.user,
  user => user
);

export const authStateSelector = createSelector(
  (authStateSelector: fromApp.AppState) => authStateSelector.auth,
  authStateSelector => authStateSelector
);

export const shoppingStateSelector = createSelector(
  (shoppingState: fromApp.AppState) => shoppingState.shoppingList,
  (shoppingState) => shoppingState
);

