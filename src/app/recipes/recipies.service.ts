import { Injectable } from "@angular/core";
import { Store } from "@ngrx/store";

import * as fromApp from "../app.reducer";
import * as RecipesActions from "./recipes.actions";
import { Recipe } from "./recipe.model";

@Injectable({ providedIn: 'root' })
export class RecipeService {
  constructor(private store: Store<fromApp.AppState>) {
  }

  private getCurrentDate() {
    const today = new Date();
    const day = today.getDate() < 10 ? '0' + today.getDate() : today.getDate();
    const month = (today.getMonth() + 1) < 10 ? '0' + (today.getMonth() + 1) : (today.getMonth() + 1);
    return day + '/' + month + '/' + today.getFullYear();
  }

  addRecipe(recipe: Recipe, userId: string) {
    this.store.dispatch(new RecipesActions.AddRecipeStart(
      { recipe: {
          ...recipe,
          lastUpdated: this.getCurrentDate(),
          createdBy: userId
      } }
    ));
  }

  updateRecipe(recipe: Recipe) {
    this.store.dispatch(new RecipesActions.UpdateRecipeStart(
      { recipe: { ...recipe, lastUpdated: this.getCurrentDate() } }
    ));
  }

  deleteRecipe() {
    this.store.dispatch(new RecipesActions.DeleteRecipe());
  }
}
