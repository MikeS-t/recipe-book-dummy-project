import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { NgForm } from "@angular/forms";
import { select, Store } from "@ngrx/store";

import { Ingredient } from "../ingredient.model";
import * as ShoppingListActions from "../shopping-list.actions";
import * as fromApp from "../../app.reducer";
import { shoppingStateSelector } from "../../shared/selectors";
import { Observable } from "rxjs/internal/Observable";
import { State as ShoppingState } from "../shopping-list.reducer";

@Component({
  selector: 'app-shopping-list-edit',
  templateUrl: './shopping-list-edit.component.html'
})
export class ShoppingListEditComponent implements OnInit, OnDestroy {
  @ViewChild('form', { static: false }) form: NgForm;
  shoppingState$: Observable<ShoppingState>;
  isShoppingListEmpty: boolean;

  constructor(private store: Store<fromApp.AppState>) {}

  ngOnInit() {
    this.shoppingState$ = this.store.pipe(select(shoppingStateSelector));
  }

  onSubmit(editMode: boolean) {
    const newIngredient = new Ingredient(this.form.value.name, this.form.value.amount);
    if (editMode) {
      this.store.dispatch(new ShoppingListActions.UpdateIngredient({ ingredient: newIngredient }));
    } else {
      this.store.dispatch(new ShoppingListActions.AddIngredient({ ingredient: newIngredient }));
    }
    this.onClearForm();
  }

  onClearForm() {
    this.form.resetForm();
    this.store.dispatch(new ShoppingListActions.StopEdit());
  }

  onDeleteIngredient() {
    this.store.dispatch(new ShoppingListActions.DeleteIngredient());
    this.onClearForm();
  }

  onDeleteIngredients() {
    this.store.dispatch(new ShoppingListActions.DeleteIngredients());
    this.onClearForm();
  }

  ngOnDestroy() {
    this.store.dispatch(new ShoppingListActions.StopEdit());
  }
}
