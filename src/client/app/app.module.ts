import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { APP_BASE_HREF, HashLocationStrategy, LocationStrategy } from '@angular/common';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AboutModule } from './about/about.module';
import { HomeModule } from './home/home.module';
import { SharedModule } from './shared/shared.module';
import { CoreModule } from './core/core.module';
import { TermsModule } from './terms/terms.module';

import { HomeService } from './home/home.service';
import { NavbarService } from './core/navbar/navbar.service';
import { AboutService } from './about/about.service';
import { HTTPInterceptor } from './http-interceptor';
import { StripeService } from './stripe/stripe.service';

@NgModule({
  imports: [
    BrowserModule,
    CoreModule,
    HttpClientModule,
    AppRoutingModule,
    AboutModule,
    HomeModule,
    FormsModule,
    TermsModule,
    ReactiveFormsModule,
    SharedModule.forRoot()
  ],
  declarations: [AppComponent],
  providers: [
    {
      provide: APP_BASE_HREF,
      useValue: '<%= APP_BASE %>'
    },
    {
      provide: LocationStrategy,
      useClass: HashLocationStrategy
    },
    {
      provide: HTTP_INTERCEPTORS, useClass: HTTPInterceptor, multi: true
    },
    HomeService,
    NavbarService,
    AboutService,
    StripeService
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
