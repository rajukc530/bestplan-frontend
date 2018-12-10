import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { HomeComponent } from './home.component';
import { HomeRoutingModule } from './home-routing.module';
import { SharedModule } from '../shared/shared.module';
import { Ng5SliderModule } from 'ng5-slider';
import { NgxMyDatePickerModule } from 'ngx-mydatepicker';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
import { NgxLoadingModule, ngxLoadingAnimationTypes } from 'ngx-loading';
import { PaymentComponent } from '../core/payment/payment.component';
import { NgxPageScrollModule } from 'ngx-page-scroll';

@NgModule({
  imports: [
    HomeRoutingModule,
    SharedModule,
    Ng5SliderModule,
    ReactiveFormsModule,
    NgxMyDatePickerModule.forRoot(),
    BrowserAnimationsModule,
    NgxPageScrollModule,
    ToastrModule.forRoot({
      timeOut: 3000,
      positionClass: 'toast-bottom-right',
      preventDuplicates: true
    }),
    NgxLoadingModule.forRoot({
      animationType: ngxLoadingAnimationTypes.threeBounce,
      backdropBackgroundColour: 'rgba(0,0,0,0.1)',
      backdropBorderRadius: '20px',
      primaryColour: '#555555',
      secondaryColour: '#555555',
      tertiaryColour: '#555555',
      fullScreenBackdrop: true
    })
  ],
  declarations: [HomeComponent, PaymentComponent],
  exports: [HomeComponent, PaymentComponent]
})
export class HomeModule {}
