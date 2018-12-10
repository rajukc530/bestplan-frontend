import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpResponse
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { NavbarService } from '../app/core/navbar/navbar.service';

@Injectable()
export class HTTPInterceptor implements HttpInterceptor {
  constructor(private navbarService: NavbarService) {}
  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      tap(
        (event) => {},
        (error) => {
          // console.log('error ', JSON.stringify(error.error.messageCode));
          if (error.error.messageCode === 'JWT_EXPIRED') {
            this.navbarService.doLogout();
          }
        }
      ),
    );
  }
}
