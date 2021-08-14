import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { FormsModule } from "@angular/forms";

import { AuthComponent } from "./auth/auth.component";
import { SharedModule } from "../shared/shared.module";

const authRoutes: Routes = [
  { path: '', component: AuthComponent }
];

@NgModule({
  declarations: [
    AuthComponent
  ],
  imports: [
    FormsModule,
    SharedModule,
    RouterModule.forChild(authRoutes),
  ]
})

export class AuthModule {}
