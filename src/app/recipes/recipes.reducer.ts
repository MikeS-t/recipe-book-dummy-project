import * as RecipesActions from "./recipes.actions";

import { Recipe } from "./recipe.model";

export interface State {
  recipes: Recipe [],
  selectedRecipeId: string,
  adjacentRecipeId: string,
  tempRecipeData: Recipe,
  recipesNetworkError: string
}

const initialState: State = {
  recipes: [],
  selectedRecipeId: null,
  adjacentRecipeId: null,
  tempRecipeData: null,
  recipesNetworkError: null
};

function getRecipeIndex (id: string, recipes: Recipe []): number {
  const selectedRecipe = recipes.find(recipe => recipe.id === id);
  return recipes.indexOf(selectedRecipe);
}

export function recipesReducer (
  state: State = initialState,
  action: RecipesActions.RecipesActions) {
  switch (action.type) {
    case RecipesActions.LOAD_RECIPES:
      return {
        ... state,
        recipes: [],
        selectedRecipeId: null,
        adjacentRecipeId: null,
        recipesNetworkError: null
      };

    case RecipesActions.LOAD_RECIPES_FAIL:
      return { ... state, recipesNetworkError: action.payload.errorMsg };

    case RecipesActions.SET_RECIPES:
      return { ... state, recipes: [...action.payload.recipes] };

    case RecipesActions.ADD_RECIPE_START:
      return { ... state, tempRecipeData: action.payload.recipe };

    case RecipesActions.ADD_RECIPE_SUCCESS:
      const newRecipe = { ...state.tempRecipeData, id: action.payload.recipeId };

      return { ... state, recipes: [...state.recipes, newRecipe], tempRecipeData: null };

    case RecipesActions.UPDATE_RECIPE_SUCCESS:
      const updatedRecipesOnUpdate = JSON.parse(JSON.stringify(state.recipes));
      updatedRecipesOnUpdate[getRecipeIndex(action.payload.recipe.id, updatedRecipesOnUpdate)] =
        action.payload.recipe;

      return { ... state, recipes: updatedRecipesOnUpdate };

    case RecipesActions.DELETE_RECIPE:
      //Getting an adjacent recipe id to display
      const recipesArray = [ ...state.recipes];
      const selectedRecipeIndex = getRecipeIndex(state.selectedRecipeId, recipesArray);
      let adjacentRecipeId: string = null;

      if(recipesArray[selectedRecipeIndex + 1]) {
        adjacentRecipeId = recipesArray[selectedRecipeIndex + 1].id;
      } else if (recipesArray[selectedRecipeIndex - 1]) {
        adjacentRecipeId = recipesArray[selectedRecipeIndex - 1].id;
      }

      //Creating copy of the recipes array and removing the deleted recipe
      const updatedRecipesOnDelete = state.recipes.filter((recipe) => {
        return recipe.id !== state.selectedRecipeId;
      });

      return { ... state, recipes: updatedRecipesOnDelete, adjacentRecipeId: adjacentRecipeId };

    case RecipesActions.SELECT_RECIPE:
      return { ... state, selectedRecipeId: action.payload.id };

    case RecipesActions.STOP_EDIT:
      return { ... state, selectedRecipeId: null };

    default:
      return state;
  }
}
