import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { DropdownDirective } from "./dropdown.directive";
import { LoadingSpinnerComponent } from "./loading-spinner/loading-spinner.component";
import { ReactiveComponentModule } from "@ngrx/component";

@NgModule({
  declarations: [
    LoadingSpinnerComponent,
    DropdownDirective
  ],
  imports: [
    CommonModule,
    ReactiveComponentModule
  ],
  exports: [
    LoadingSpinnerComponent,
    ReactiveComponentModule,
    DropdownDirective,
    CommonModule
  ]
})

export class SharedModule {}
