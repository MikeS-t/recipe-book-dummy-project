import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from "@angular/router";
import { Recipe } from "./recipe.model";
import { ActionsSubject, select, Store } from "@ngrx/store";
import { map, take } from "rxjs/operators";

import * as RecipeActions from "./recipes.actions";
import * as fromApp from "../app.reducer";
import { ofType } from "@ngrx/effects";
import { Observable } from "rxjs/internal/Observable";
import { recipesSelector } from "../shared/selectors";


@Injectable({ providedIn: 'root' })
export class RecipesResolverService implements Resolve<Recipe[]> {
  constructor(
    private store: Store<fromApp.AppState>,
    private actionListener$: ActionsSubject,
  ) {}

  recipes: Recipe [];

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot):
    Observable<Recipe []> | Promise<Recipe []> | Recipe [] {
    this.store.pipe(select(recipesSelector),take(1))
      .subscribe(recipes => {
        this.recipes = recipes;
      });

    if (this.recipes.length > 0) {
      return this.recipes;
    } else {
      this.store.dispatch(new RecipeActions.LoadRecipes());

      return this.actionListener$.pipe(
        ofType(RecipeActions.SET_RECIPES),
        take(1),
        map((action: RecipeActions.SetRecipes) => {
          return action.payload.recipes;
        })
      );
    }
  }
}
