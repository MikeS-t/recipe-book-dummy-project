import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HTTP_INTERCEPTORS, HttpClientModule } from "@angular/common/http";
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from "@ngrx/effects";
import { StoreDevtoolsModule } from "@ngrx/store-devtools";

import { AppComponent } from './app.component';
import { HeaderComponent } from './shared/header/header.component';
import { AuthInterceptorService } from "./auth/auth.interceptor.service";
import { PreloadAllModules, RouterModule, Routes } from "@angular/router";
import { SharedModule } from "./shared/shared.module";
import * as fromApp from "./app.reducer";
import { AuthEffects } from "./auth/auth.effects";
import { RecipesEffects } from "./recipes/recipes.effects";
import { ShoppingListEffects } from "./shopping-list/shopping-list.effects";
import { environment } from "../environments/environment";

const routes: Routes = [
  { path: '', redirectTo: '/recipes', pathMatch: 'full' },
  { path: 'recipes', loadChildren: () => import('./recipes/recipes.module').then(m => m.RecipesModule) },
  { path: 'shoppingList', loadChildren: () => import('./shopping-list/shopping.module').then(m => m.ShoppingModule) },
  { path: 'auth', loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule) }
];

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent
  ],
  imports: [
    SharedModule,
    BrowserModule,
    HttpClientModule,
    StoreModule.forRoot(fromApp.appReducer),
    EffectsModule.forRoot([AuthEffects, RecipesEffects, ShoppingListEffects]),
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules }),
    StoreDevtoolsModule.instrument({ logOnly: environment.production })
  ],
  providers: [{
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptorService,
      multi: true
  }],
  bootstrap: [AppComponent]
})
export class AppModule {}
