import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { FormsModule } from "@angular/forms";

import { ShoppingListComponent } from "./shopping-list/shopping-list.component";
import { ShoppingListEditComponent } from "./shopping-list-edit/shopping-list-edit.component";
import { SharedModule } from "../shared/shared.module";

const shoppingRoutes: Routes = [
  { path: '', component: ShoppingListComponent }
];

@NgModule({
  declarations: [
    ShoppingListComponent,
    ShoppingListEditComponent,
  ],
  imports: [
    FormsModule,
    SharedModule,
    RouterModule.forChild(shoppingRoutes),
  ]
})

export class ShoppingModule {}
