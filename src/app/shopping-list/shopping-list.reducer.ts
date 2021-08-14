import { Ingredient } from "./ingredient.model";
import * as ShoppingListActions from "./shopping-list.actions"

export interface State {
  ingredients: Ingredient [],
  editedIngredient: Ingredient,
  editedIngredientId: number,
  isShoppingListEmpty: boolean
}

const initialState: State = {
  ingredients: [],
  editedIngredient: null,
  editedIngredientId: -1,
  isShoppingListEmpty: true
};

function checkIfIngredientExists (ingredient: Ingredient, ingredients: Ingredient []) {
  const ingredientIndex = ingredients.findIndex(el => el.name === ingredient.name);
  if(ingredientIndex !== -1) {
    const newAmount = ingredients[ingredientIndex].amount + ingredient.amount;
    ingredients[ingredientIndex] = new Ingredient(ingredient.name, newAmount);
  } else {
    ingredients.push(ingredient);
  }
}

export function shoppingListReducer(
  state: State = initialState,
  action: ShoppingListActions.ShoppingListActions) {
  switch (action.type) {
    case ShoppingListActions.ADD_INGREDIENT:
      const addIngredientArray = [ ...state.ingredients];
      checkIfIngredientExists(action.payload.ingredient, addIngredientArray);

      return {
        ...state,
        ingredients: addIngredientArray,
        isShoppingListEmpty: false
      };

    case ShoppingListActions.ADD_INGREDIENTS:
      const addIngredientsArray = [ ...state.ingredients];

      for(const ingredient of action.payload.ingredients) {
        checkIfIngredientExists(ingredient, addIngredientsArray);
      }

      return {
        ...state,
        ingredients: addIngredientsArray,
        isShoppingListEmpty: false
      };

    case ShoppingListActions.UPDATE_INGREDIENT:
      const ingredient = state.ingredients[state.editedIngredientId];
      const updatedIngredient = { ...ingredient, ...action.payload.ingredient };
      const updatedIngredientsOnUpdate = [...state.ingredients];

      updatedIngredientsOnUpdate[state.editedIngredientId] = updatedIngredient;

      return {
        ...state,
        ingredients: [...updatedIngredientsOnUpdate]
      };

    case ShoppingListActions.DELETE_INGREDIENT:
      const updatedRecipesOnDelete = state.ingredients.filter((el, id) => {
        return id !== state.editedIngredientId;
      });

      return {
        ...state,
        ingredients: updatedRecipesOnDelete,
        isShoppingListEmpty: !updatedRecipesOnDelete.length
      };

    case ShoppingListActions.DELETE_INGREDIENTS:
      return {
        ...state,
        ingredients: [],
        isShoppingListEmpty: true
      };

    case ShoppingListActions.START_EDIT:
      return {
        ...state,
        editedIngredient: { ...state.ingredients[action.payload.ingredientIndex] },
        editedIngredientId: action.payload.ingredientIndex
      };

    case ShoppingListActions.STOP_EDIT:
      return {
        ...state,
        editedIngredient: null,
        editedIngredientId: -1
      };

    default:
      return state;
  }
}
