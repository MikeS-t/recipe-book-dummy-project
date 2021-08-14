import { Action } from "@ngrx/store";

import { Recipe } from "./recipe.model";

export const LOAD_RECIPES = '[Recipes] Load Recipes';
export const LOAD_RECIPES_FAIL = '[Recipes] Load Recipes Fail';
export const SET_RECIPES = '[Recipes] Set Recipes';
export const ADD_RECIPE_START = '[Recipes] Add Recipe Start';
export const ADD_RECIPE_SUCCESS = '[Recipes] Add Recipe Success';
export const UPDATE_RECIPE_START = '[Recipes] Update Recipe Start';
export const UPDATE_RECIPE_SUCCESS= '[Recipes] Update Recipe Success';
export const DELETE_RECIPE = '[Recipes] Delete Recipe';
export const SELECT_RECIPE = '[Recipes] Select Recipe';
export const STOP_EDIT = '[Recipes] Stop Edit';


export class LoadRecipes implements Action {
  readonly type = LOAD_RECIPES;
}

export class LoadRecipesFail implements Action {
  readonly type = LOAD_RECIPES_FAIL;
  constructor(public payload: { errorMsg: string }) {}
}

export class SetRecipes implements Action {
  readonly type = SET_RECIPES;
  constructor(public payload: { recipes: Recipe[] }) {}
}

export class AddRecipeStart implements Action {
  readonly type = ADD_RECIPE_START;
  constructor(public payload: { recipe: Recipe }) {}
}

export class AddRecipeSuccess implements Action {
  readonly type = ADD_RECIPE_SUCCESS;
  constructor(public payload: { recipeId: string }) {}
}

export class UpdateRecipeStart implements Action {
  readonly type = UPDATE_RECIPE_START;
  constructor(public payload: { recipe: Recipe }) {}
}

export class UpdateRecipeSuccess implements Action {
  readonly type = UPDATE_RECIPE_SUCCESS;
  constructor(public payload: { recipe: Recipe }) {}
}

export class DeleteRecipe implements Action {
  readonly type = DELETE_RECIPE;
}

export class SelectRecipe implements Action {
  readonly type = SELECT_RECIPE;
  constructor(public payload: { id: string }) {}
}

export class StopEdit implements Action {
  readonly type = STOP_EDIT;
}

export type RecipesActions =
  LoadRecipes
  | LoadRecipesFail
  | SetRecipes
  | AddRecipeStart
  | AddRecipeSuccess
  | UpdateRecipeStart
  | UpdateRecipeSuccess
  | DeleteRecipe
  | SelectRecipe
  | StopEdit;
