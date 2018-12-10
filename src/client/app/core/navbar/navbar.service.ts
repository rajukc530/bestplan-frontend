import { Injectable, Output, EventEmitter } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { LoginModel } from '../../model/login.model';
import { Hostname } from '../../shared/hostname';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable()
export class NavbarService {
  @Output() userProfile: EventEmitter<any> = new EventEmitter();
  isLoggedIn: boolean;
  currentURL = '';
  isNavClicked = false;
  navClass = '';
  toggleClass = '';
  private hostname: string;
  constructor(private httpClient: HttpClient, private router: Router) {}

  doLogin(loginModel: LoginModel) {
    this.hostname = Hostname.BASE_API_URL + 'login';
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    return this.httpClient
      .post<LoginModel>(
        this.hostname,
        JSON.stringify(loginModel),
        httpOptions
      )
      .pipe(catchError(this.handleError));
  }

  emitCurrentUser() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (currentUser) {
      this.isLoggedIn = true;
    }
    this.userProfile.emit(currentUser);
  }

  emitLoggOutStatus(isLoggedIn: boolean) {
    this.userProfile.emit(isLoggedIn);
  }

  setCurrentURL(currentUrl: String) {
    this.currentURL = String(currentUrl);
  }

  doLogout() {
    this.isLoggedIn = false;
    this.emitLoggOutStatus(this.isLoggedIn);
    this.clickNavIcon();
    localStorage.removeItem('currentUser');
    this.router.navigate(['/']);
  }

  clickNavIcon() {
    if (!this.isNavClicked) {
      this.isNavClicked = true;
      this.navClass = 'site-nav--open';
      this.toggleClass = 'open';
    } else {
      this.isNavClicked = false;
      this.navClass = '';
      this.toggleClass = '';
    }
  }

  /**
   *
   * @param error
   */
  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error.message);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      console.error(
        `Backend returned code ${error.status}, ` + `body was: ${error.error}`
      );
    }
    // return an observable with a user-facing error message
    return throwError('Something bad happened; please try again later.');
  }
}
