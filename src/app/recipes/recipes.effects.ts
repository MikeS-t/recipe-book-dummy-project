import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { catchError, map, switchMap, take, tap } from "rxjs/operators";
import { of } from "rxjs";

import { Recipe } from "./recipe.model";
import * as RecipesActions from "./recipes.actions";
import * as fromApp from "../app.reducer";
import { Store } from "@ngrx/store";
import { Router } from "@angular/router";

const errorHandler = (errorRes) => {
  let errorMsg = 'An unknown error occurred.';
  if (!errorRes.status) {
    return of(new RecipesActions.LoadRecipesFail({ errorMsg: errorMsg }));
  }

  switch (errorRes.status) {
    case 400:
    case 412:
      errorMsg = 'Bad request. Database is unreachable.';
      break;
    case 401:
      errorMsg = 'Unauthorized access. You do not have permission to access the database.';
      break;
    case 404:
      errorMsg = 'Could not find a database.';
      break;
    case 500:
      errorMsg = 'Could not connect to the database server.';
      break;
    case 503:
      errorMsg = 'The database service is currently not available. Please try again later.';
  }

  console.log(errorMsg);
  return of(new RecipesActions.LoadRecipesFail({ errorMsg: errorMsg }));
};

@Injectable()
export class RecipesEffects {
  constructor(
    private actions$: Actions,
    private http: HttpClient,
    private store: Store<fromApp.AppState>,
    private router: Router
  ) {}

  loadRecipes$ = createEffect(() => this.actions$.pipe(
    ofType(RecipesActions.LOAD_RECIPES),
    switchMap(() => this.http.get<Recipe[]>(
      'https://recipe-book-dummy-project-default-rtdb.europe-west1.firebasedatabase.app/recipes.json'
      )
        .pipe(
          map(recipes => {
            const preparedRecipes: Recipe [] = [];
            for (const [key, value] of Object.entries(recipes)) {
              preparedRecipes.push(new Recipe(
                key,
                value.name,
                value.description,
                value.imgPath,
                value.ingredients ? value.ingredients : [],
                value.lastUpdated,
                value.createdBy
              ))
            }

            return new RecipesActions.SetRecipes({ recipes: preparedRecipes });
          }),
          catchError(errorRes => {
            return errorHandler(errorRes);
          })
        )
    )
  ));

  uploadRecipe$ = createEffect(() => this.actions$.pipe(
    ofType(RecipesActions.ADD_RECIPE_START),
    switchMap((recipeData: RecipesActions.AddRecipeStart) => {
      return of(recipeData.payload.recipe);
    }),
    switchMap((newRecipe: Recipe) => {
        return this.http.post(
          'https://recipe-book-dummy-project-default-rtdb.europe-west1.firebasedatabase.app/recipes.json',
          newRecipe
        ).pipe(
          map((res: { name: string }) => {
            return new RecipesActions.AddRecipeSuccess({ recipeId: res.name });
        }),
          catchError(errorRes => {
            return errorHandler(errorRes);
          })
        )
      }
    )
  ));


  updateRecipe$ = createEffect(() => this.actions$.pipe(
    ofType(RecipesActions.UPDATE_RECIPE_START),
    switchMap((recipeData: RecipesActions.UpdateRecipeStart) => {
      const updatedRecipe = recipeData.payload.recipe;
        return this.http.patch(
          'https://recipe-book-dummy-project-default-rtdb.europe-west1.firebasedatabase.app/recipes/' +
          updatedRecipe.id + '.json',
          updatedRecipe
        ).pipe(
          map((res: Recipe) => {
            const updatedRecipe = new Recipe(
              res.id,
              res.name,
              res.description,
              res.imgPath,
              res.ingredients ? res.ingredients : [],
              res.lastUpdated,
              res.createdBy
            );
            return new RecipesActions.UpdateRecipeSuccess({ recipe: updatedRecipe });
          }),
          catchError(errorRes => {
            return errorHandler(errorRes);
          })
        )
      }
    )
  ));

  deleteRecipe$ = createEffect(() => this.actions$.pipe(
    ofType(RecipesActions.DELETE_RECIPE),
    switchMap(() => {
      return this.store.select('recipes').pipe(
        take(1),
        tap((recipesState) => {
          if(recipesState.adjacentRecipeId !== null) {
            const adjacentRecipeId = recipesState.adjacentRecipeId;
            this.router.navigate(['/recipes/' + adjacentRecipeId]);
          }
        }),
        map(recipesState => {
          return recipesState.selectedRecipeId;
        })
      )
    }),
    switchMap((recipeId: string) => {
        return this.http.delete(
          'https://recipe-book-dummy-project-default-rtdb.europe-west1.firebasedatabase.app/recipes/'
          + recipeId + '.json',
        ).pipe(
          map(() => {
            return { type: 'NO_EFFECT' };
          }),
          catchError(errorRes => {
            return errorHandler(errorRes);
          })
        )
      }
    )
  ));

}
