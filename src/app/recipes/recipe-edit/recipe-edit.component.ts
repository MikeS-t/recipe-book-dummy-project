import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from "@angular/router";
import { FormArray, FormGroup } from "@angular/forms";
import { select, Store } from "@ngrx/store";
import { Subscription } from "rxjs/internal/Subscription";
import { take } from "rxjs/operators";
import { combineLatest } from "rxjs";

import * as fromApp from "../../app.reducer";
import * as RecipesActions from "../recipes.actions";
import { userSelector, recipesSelector } from "../../shared/selectors";
import { Recipe } from "../recipe.model";
import { User } from "../../auth/user.model";
import { RecipeService } from "../recipies.service";

import { initiateRecipeForm, addNewIngredientControl } from "./recipe-edit-form";

@Component({
  selector: 'app-recipe-edit',
  templateUrl: './recipe-edit.component.html'
})
export class RecipeEditComponent implements OnInit, OnDestroy {
  editMode: boolean;
  id: string;
  selectedRecipe: Recipe;
  recipeForm: FormGroup;
  subscription: Subscription;
  private userId: string;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private store: Store<fromApp.AppState>,
    private recipeService: RecipeService
  ) {}

  ngOnInit() {
    const params$ = this.route.params;
    const user$ = this.store.pipe(select(userSelector));
    const recipes$ = this.store.pipe(select(recipesSelector));
    //Getting data about URL id param, userData and recipes
    this.subscription = combineLatest([params$, user$, recipes$]).pipe(take(1))
      .subscribe((data: [Params, User, Recipe[]]) => {
        //Setting the edit mode depending if we have id or no
        this.editMode = data[0]['id'] != null;
        if (this.editMode) {
          // Selecting the recipe if we are in edit mode
          this.id = data[0]['id'];
          this.store.dispatch(new RecipesActions.SelectRecipe({ id: this.id }));
        }
        //Getting the user id and initiating the edit form
        this.userId = data[1].id;
        this.selectedRecipe = data[2].find(recipe => recipe.id === this.id);
        this.recipeForm = initiateRecipeForm(this.selectedRecipe);
      });
  }

  get controls() { // a getter for the recipe ingredients!
    return (<FormArray>this.recipeForm.get('ingredients')).controls;
  }

  onSubmit() {
    const updatedRecipe = { ...this.selectedRecipe, ...this.recipeForm.value };
    if (this.editMode) {
      this.recipeService.updateRecipe(updatedRecipe);
    } else {
      this.recipeService.addRecipe(updatedRecipe, this.userId);
    }
    this.onCancel()
  }

  onCancel() {
    this.router.navigate(['../'], { relativeTo: this.route });
  }

  onAddIngredient() {
    (<FormArray>this.recipeForm.get('ingredients')).push(addNewIngredientControl());
  }

  onDeleteIngredient(index: number) {
    (<FormArray>this.recipeForm.get('ingredients')).removeAt(index);
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
    this.store.dispatch(new RecipesActions.StopEdit());
  }
}
