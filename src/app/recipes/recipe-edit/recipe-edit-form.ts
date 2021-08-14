import { Recipe } from "../recipe.model";
import { FormArray, FormControl, FormGroup, Validators } from "@angular/forms";

export const initiateRecipeForm = (recipe: Recipe): FormGroup => {
  //Initialize the form properties
  let recipeName = '';
  let recipeImage = '';
  let recipeDescription = '';
  let recipeIngredients = new FormArray([]);

  if (recipe) {
    //Populate the properties if we are in edit mode
    recipeName = recipe.name;
    recipeImage = recipe.imgPath;
    recipeDescription = recipe.description;
    if (recipe['ingredients']) { //!!! Thats how u check if object contains such property
      //Create new ingredient form control for every recipe ingredient
      for (let ingredient of recipe.ingredients) {
        recipeIngredients.push(
          new FormGroup({
            'name': new FormControl(ingredient.name, Validators.required),
            'amount': new FormControl(ingredient.amount, [
              Validators.required,
              Validators.pattern(/^[1-9]+[0-9]*$/)
            ])
          })
        );
      }
    }
  }

  //Return the form
  return new FormGroup({
    'name': new FormControl(recipeName, Validators.required),
    'imgPath': new FormControl(recipeImage, Validators.required),
    'description': new FormControl(recipeDescription, Validators.required),
    'ingredients': recipeIngredients
  });
};

export const addNewIngredientControl = (): FormGroup => {
  return new FormGroup({
    'name': new FormControl(null, Validators.required),
    'amount': new FormControl(null, [
      Validators.required,
      Validators.pattern(/^[1-9]+[0-9]*$/)
    ])
  })
};
