import { Injectable, Output, EventEmitter } from '@angular/core';
import {
  HttpClient,
  HttpHeaders,
  HttpErrorResponse
} from '@angular/common/http';
import { Hostname } from '../shared/hostname';
import { StripeModel } from '../model/stripe.model';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable()
export class StripeService {
  private hostname: string;
  constructor(private httpClient: HttpClient) {}

  placeStripeOrder(stripeModel: StripeModel) {
    console.log('placing order from stripe ', JSON.stringify(stripeModel));
    this.hostname = Hostname.BASE_API_URL + 'user/stripeorder';
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    return this.httpClient
      .post<StripeModel>(
        this.hostname,
        JSON.stringify(stripeModel),
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
