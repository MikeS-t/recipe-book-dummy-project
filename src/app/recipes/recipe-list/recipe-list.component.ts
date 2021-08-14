import { Component, OnInit } from '@angular/core';
import { select, Store } from "@ngrx/store";
import { Observable } from "rxjs/internal/Observable";

import * as fromApp from "../../app.reducer";
import { Recipe } from "../recipe.model";
import { userSelector, recipesSelector } from "../../shared/selectors";
import { User } from "../../auth/user.model";

@Component({
  selector: 'app-recipe-list',
  templateUrl: './recipe-list.component.html'
})
export class RecipeListComponent implements OnInit {
  recipes$: Observable<Recipe []>;
  user$: Observable<User>;

  constructor(private store: Store<fromApp.AppState>) {}

  ngOnInit() {
    this.recipes$ = this.store.pipe(select(recipesSelector));
    this.user$ = this.store.pipe(select(userSelector));
  }
}
