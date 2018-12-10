import { Injectable, Output, EventEmitter } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Hostname } from '../shared/hostname';
import { PageVisitModel } from '../model/pageVisit.model';
import { Modal } from '../model/modal';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable()
export class HomeService {
  @Output() userProfile: EventEmitter<any> = new EventEmitter();
  isLoggedIn: boolean;
  private hostname: string;
  constructor(private httpClient: HttpClient) {}

  placeOrder(plan: Modal) {
    console.log('placing order ', JSON.stringify(plan));
    this.hostname = Hostname.BASE_API_URL + 'user/';
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    return this.httpClient
      .post<Modal>(
        this.hostname,
        JSON.stringify(plan),
        httpOptions
      )
      .pipe(catchError(this.handleError));
  }

  getPlanPrice(planName: String) {
    this.hostname = Hostname.BASE_API_URL + 'plan/name/' + planName;
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    return this.httpClient.get(this.hostname, httpOptions)
      .pipe(catchError(this.handleError));
  }

  addToPageVisits(paveVisitModel: PageVisitModel) {
    this.hostname = Hostname.BASE_API_URL + 'pagevisit';
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    return this.httpClient
      .post<PageVisitModel>(
        this.hostname,
        JSON.stringify(paveVisitModel),
        httpOptions
      )
      .pipe(catchError(this.handleError));
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
