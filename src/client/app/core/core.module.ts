import { NgModule, Optional, SkipSelf } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { NavbarComponent } from './navbar/navbar.component';
import { throwIfAlreadyLoaded } from './module-import-guard';
import { ToolbarComponent } from './toolbar/toolbar.component';
import { NgxPageScrollModule } from 'ngx-page-scroll';

@NgModule({
  imports: [RouterModule, CommonModule, ReactiveFormsModule, NgxPageScrollModule],
  declarations: [NavbarComponent, ToolbarComponent],
  exports: [RouterModule,
    NavbarComponent, ToolbarComponent]
})
export class CoreModule {

  constructor( @Optional() @SkipSelf() parentModule: CoreModule) {
    throwIfAlreadyLoaded(parentModule, 'CoreModule');
  }
}
