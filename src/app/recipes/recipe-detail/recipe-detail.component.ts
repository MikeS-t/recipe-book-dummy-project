import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router, Params } from "@angular/router";
import { select, Store } from "@ngrx/store";
import { map, tap } from "rxjs/operators";
import { Observable } from "rxjs/internal/Observable";

import { Recipe } from "../recipe.model";
import * as ShoppingListActions from "../../shopping-list/shopping-list.actions";
import * as RecipesActions from "../recipes.actions";
import * as fromApp from "../../app.reducer";
import { userSelector, recipesSelector } from "../../shared/selectors";
import { Ingredient } from "../../shopping-list/ingredient.model";
import { User } from "../../auth/user.model";
import { Subscription } from "rxjs/internal/Subscription";
import { RecipeService } from "../recipies.service";

@Component({
  selector: 'app-recipe-detail',
  templateUrl: './recipe-detail.component.html'
})
export class RecipeDetailComponent implements OnInit, OnDestroy {
  displayedRecipe$: Observable<Recipe>;
  user$: Observable<User>;
  showIngredients = false;
  subscription: Subscription;

  constructor(
    private store: Store<fromApp.AppState>,
    private recipeService: RecipeService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    //Getting the currently logged user
    this.user$ = this.store.pipe(select(userSelector));

    //Getting the data for the displayed recipe
    this.subscription = this.route.params.subscribe((params: Params) => {
      this.displayedRecipe$ = this.store.pipe(
        select(recipesSelector),
        tap((recipes: Recipe []) => {
          //Redirecting to the first recipe if there is no selected recipe
          if (params['id'] === undefined && recipes.length) {
            this.router.navigate((['/recipes/' + recipes[0].id]));
          } else {
            this.store.dispatch(new RecipesActions.SelectRecipe({ id: params['id'] }));
          }
        }),
        map((recipes: Recipe []) => {
          return recipes.length ? recipes.find(recipe => recipe.id === params['id']) : null;
        })
      )
    });
  }

  onShowIngredients() {
    this.showIngredients = !this.showIngredients;
  }

  onDeleteRecipe() {
    this.recipeService.deleteRecipe()
  }

  toShoppingList(ingredients: Ingredient []) {
    this.store.dispatch(new ShoppingListActions.AddIngredients({ ingredients: ingredients }));
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
