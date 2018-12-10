import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TermsComponent } from './terms.component';
import { TermsRoutingModule } from './terms-routing.module';

@NgModule({
  imports: [
    TermsRoutingModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
  ],
  declarations: [TermsComponent],
  exports: [TermsComponent]
})
export class TermsModule {}
