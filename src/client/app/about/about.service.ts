import { Injectable, OnInit, Output, EventEmitter } from '@angular/core';
import {
  HttpClient,
  HttpHeaders,
  HttpErrorResponse
} from '@angular/common/http';
import { Hostname } from '../shared/hostname';
import { throwError, Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Modal } from '../model/modal';
import { WeightModel } from '../model/weight.model';
import { ProgramModel } from '../model/program.model';
import { DietModel } from '../model/diet.model';
import { TrainingModel } from '../model/training.model';
import { TrainingAndDietModel } from '../model/traininganddiet.model';

@Injectable()
export class AboutService implements OnInit {
  isLoggedIn: boolean;
  @Output() userProfile: EventEmitter<any> = new EventEmitter();
  private hostname: string;
  constructor(private httpClient: HttpClient) {}

  ngOnInit() {
    this.isLoggedIn = this.checkIfUserIsLoggedIn();
  }

  checkIfUserIsLoggedIn() {
    const user = JSON.parse(localStorage.getItem('currentUser'));
    if (user !== null) {
        return true;
    }
    return false;
  }

  getUserProfile(token: string): Observable<Modal> {
    this.hostname = Hostname.BASE_API_URL + 'user/profile';
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer' + token,
      })
    };
    return this.httpClient
      .get<Modal>(
        this.hostname,
        httpOptions
      )
      .pipe(catchError(this.handleError));
  }

  getPlanDetails() {
    const user = JSON.parse(localStorage.getItem('currentUser'));
    this.hostname = Hostname.BASE_API_URL + 'user/plan/details';
    const httpOptions = {
      headers: new HttpHeaders({
        'Authorization': user.token,
      })
    };
    return this.httpClient
      .get(this.hostname, httpOptions)
      .pipe(catchError(this.handleError));
  }

  findAllPrograms(programModel: ProgramModel) {
    // console.log('program modal ', JSON.stringify(programModel));
    const user = JSON.parse(localStorage.getItem('currentUser'));
    this.hostname = Hostname.BASE_API_URL + 'user/programs';
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': user.token,
      })
    };
    return this.httpClient
      .post(this.hostname, JSON.stringify(programModel), httpOptions)
      .pipe(catchError(this.handleError));
  }

  buyNewDietProgram(dietModel: DietModel) {
    const user = JSON.parse(localStorage.getItem('currentUser'));
    this.hostname = Hostname.BASE_API_URL + 'user/dietprogram';
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': user.token,
      })
    };
    return this.httpClient
      .post(this.hostname, JSON.stringify(dietModel), httpOptions)
      .pipe(catchError(this.handleError));
  }

  buyNewTrainingProgram(trainingModel: TrainingModel) {
    const user = JSON.parse(localStorage.getItem('currentUser'));
    this.hostname = Hostname.BASE_API_URL + 'user/trainingprogram';
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': user.token,
      })
    };
    return this.httpClient
      .post(this.hostname, JSON.stringify(trainingModel), httpOptions)
      .pipe(catchError(this.handleError));
  }

  buyBothPrograms(trainingAndDietModel: TrainingAndDietModel) {
    const user = JSON.parse(localStorage.getItem('currentUser'));
    this.hostname = Hostname.BASE_API_URL + 'user/bothprogram';
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': user.token,
      })
    };
    return this.httpClient
      .post(this.hostname, JSON.stringify(trainingAndDietModel), httpOptions)
      .pipe(catchError(this.handleError));
  }

  emitProfileData(data: String) {
    const profileData = data;
    // console.log('profile Data ', profileData);
    this.userProfile.emit(profileData);
  }

  listDietDetailsFiles(diet: String, dietName: String, category: String) {
    const user = JSON.parse(localStorage.getItem('currentUser'));
    this.hostname = Hostname.BASE_API_URL + 'diet/listfiles?route=' + diet + '&name=' + dietName + '&category=' + category;
    const httpOptions = {
      headers: new HttpHeaders({
        'Authorization': user.token,
      })
    };
    return this.httpClient
      .get(this.hostname, httpOptions)
      .pipe(catchError(this.handleError));
  }

  downloadDietFile(route: String, folder: String, fileName: String, category: String) {
    const user = JSON.parse(localStorage.getItem('currentUser'));
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': user.token,
      })
    };
    this.hostname = Hostname.BASE_API_URL + 'diet/downloadFile';
    const data = { route: route, folder: folder, name: fileName, category: category};
    return this.httpClient
      .post(this.hostname, data, {responseType: 'blob', headers: httpOptions.headers})
      .pipe(catchError(this.handleError));
  }

  listTrainingDetailsFiles(diet: String, dietName: String) {
    const user = JSON.parse(localStorage.getItem('currentUser'));
    this.hostname = Hostname.BASE_API_URL + 'training/listfiles?route=' + diet + '&name=' + dietName;
    const httpOptions = {
      headers: new HttpHeaders({
        'Authorization': user.token,
      })
    };
    return this.httpClient
      .get(this.hostname, httpOptions)
      .pipe(catchError(this.handleError));
  }

  downloadTrainingFile(route: String, categoryName: String, fileName: String) {
    const user = JSON.parse(localStorage.getItem('currentUser'));
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': user.token,
      })
    };
    this.hostname = Hostname.BASE_API_URL + 'training/downloadFile';
    const data = { route: route, category: categoryName, name: fileName};
    return this.httpClient
      .post(this.hostname, data, {responseType: 'blob', headers: httpOptions.headers})
      .pipe(catchError(this.handleError));
  }

  updateWeight(weight: WeightModel) {
    const user = JSON.parse(localStorage.getItem('currentUser'));
    this.hostname = Hostname.BASE_API_URL + 'updateweight';
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer' + user.token,
      })
    };
    return this.httpClient
      .post(
        this.hostname,
        JSON.stringify(weight),
        httpOptions
      )
      .pipe(catchError(this.handleError));
  }

  getUserRecentWeight() {
    const user = JSON.parse(localStorage.getItem('currentUser'));
    this.hostname = Hostname.BASE_API_URL + 'updateweight/recent';
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer' + user.token,
      })
    };
    return this.httpClient
      .get(
        this.hostname,
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

  updateToTrainingPlan(trainingModel: TrainingModel) {
    const user = JSON.parse(localStorage.getItem('currentUser'));
    this.hostname = Hostname.BASE_API_URL + 'user/updatetrainingplan/';
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer' + user.token,
      })
    };
    return this.httpClient.put(this.hostname, JSON.stringify(trainingModel), httpOptions)
      .pipe(catchError(this.handleError));
  }

  updateToDietPlan(dietModel: DietModel) {
    const user = JSON.parse(localStorage.getItem('currentUser'));
    this.hostname = Hostname.BASE_API_URL + 'user/updatedietplan/';
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer' + user.token,
      })
    };
    return this.httpClient.put(this.hostname, JSON.stringify(dietModel), httpOptions)
      .pipe(catchError(this.handleError));
  }

  getUserGoalWeight() {
    const user = JSON.parse(localStorage.getItem('currentUser'));
    this.hostname = Hostname.BASE_API_URL + 'user/goalweight';
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer' + user.token,
      })
    };
    return this.httpClient
      .get(this.hostname, httpOptions)
      .pipe(catchError(this.handleError));
  }

  getMacrosForUser() {
    const user = JSON.parse(localStorage.getItem('currentUser'));
    this.hostname = Hostname.BASE_API_URL + 'user/macros';
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer' + user.token,
      })
    };
    return this.httpClient
      .get(
        this.hostname,
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
