import { Action } from "@ngrx/store";
import { Ingredient } from "./ingredient.model";

export const AUTO_LOAD_INGREDIENTS = '[Shopping List] Auto Load Ingredients';
export const ADD_INGREDIENT = '[Shopping List] Add Ingredient';
export const ADD_INGREDIENTS = '[Shopping List] Add Ingredients';
export const UPDATE_INGREDIENT = '[Shopping List] Update Ingredient';
export const DELETE_INGREDIENT = '[Shopping List] Delete Ingredient';
export const DELETE_INGREDIENTS = '[Shopping List] Delete Ingredients';
export const START_EDIT = '[Shopping List] Start Edit';
export const STOP_EDIT = '[Shopping List] Stop Edit';

export class AutoLoadIngredients implements Action {
  readonly type = AUTO_LOAD_INGREDIENTS;
}

export class AddIngredient implements Action {
  readonly type = ADD_INGREDIENT;
  constructor(public payload: { ingredient: Ingredient }) {}
}

export class AddIngredients implements Action {
  readonly type = ADD_INGREDIENTS;
  constructor(public payload: { ingredients: Ingredient[] }) {}
}

export class UpdateIngredient implements Action {
  readonly type = UPDATE_INGREDIENT;
  constructor(public payload: { ingredient: Ingredient }) {}
}

export class DeleteIngredient implements Action {
  readonly type = DELETE_INGREDIENT;
}

export class DeleteIngredients implements Action {
  readonly type = DELETE_INGREDIENTS;
}

export class StartEdit implements Action {
  readonly type = START_EDIT;
  constructor(public payload: { ingredientIndex: number }) {}
}

export class StopEdit implements Action {
  readonly type = STOP_EDIT;
}

export type ShoppingListActions =
  AutoLoadIngredients
  | AddIngredient
  | AddIngredients
  | UpdateIngredient
  | DeleteIngredient
  | DeleteIngredients
  | StartEdit
  | StopEdit;
