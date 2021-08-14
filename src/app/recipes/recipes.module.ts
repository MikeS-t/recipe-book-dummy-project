import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { ReactiveFormsModule } from "@angular/forms";

import { SharedModule } from "../shared/shared.module";
import { RecipeItemComponent } from "./recipe-item/recipe-item.component";
import { RecipeDetailComponent } from "./recipe-detail/recipe-detail.component";
import { RecipeListComponent } from "./recipe-list/recipe-list.component";
import { RecipeEditComponent } from "./recipe-edit/recipe-edit.component";

import { RecipesResolverService } from "./recipes.resolver.service";
import { AuthGuardService } from "../auth/auth.guard.service";

const recipeRoutes: Routes = [
  { path: '', component: RecipeListComponent,
    resolve: [RecipesResolverService],
    children: [
      { path: '', component: RecipeDetailComponent },
      {
        path: 'new',
        component: RecipeEditComponent,
        canActivate: [AuthGuardService]
      },
      {
        path: ':id',
        component: RecipeDetailComponent
      },
      {
        path: ':id/edit',
        component: RecipeEditComponent,
        canActivate: [AuthGuardService]
      }
    ]}
];

@NgModule({
  declarations: [
    RecipeDetailComponent,
    RecipeListComponent,
    RecipeItemComponent,
    RecipeEditComponent
  ],
  imports: [
    SharedModule,
    ReactiveFormsModule,
    RouterModule.forChild(recipeRoutes),
  ]
})

export class RecipesModule {}
