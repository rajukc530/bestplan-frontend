import { Component, OnInit, ElementRef, ViewChild, NgZone } from '@angular/core';
import { AboutService } from './about.service';
import { Router, ActivatedRoute } from '@angular/router';
import { LoginModel } from '../model/login.model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { WeightModel } from '../model/weight.model';
import { ProgramModel } from '../model/program.model';
import { DietModel } from '../model/diet.model';
import { TrainingModel } from '../model/training.model';
import { ToastrService } from 'ngx-toastr';
import { StripeModel } from '../model/stripe.model';
import { StripeService } from '../stripe/stripe.service';
import { ProfileModel } from '../model/profile.model';
import { TrainingAndDietModel } from '../model/traininganddiet.model';
declare const saveAs: any;

/**
 * This class represents the lazy loaded AboutComponent.
 */
@Component({
  moduleId: module.id,
  selector: 'sd-about',
  templateUrl: 'about.component.html',
  styleUrls: ['about.component.css']
})
export class AboutComponent implements OnInit {
  profile: ProfileModel = new ProfileModel();
  loginModel: LoginModel = new LoginModel();
  planName = '';
  fat = '';
  protein = '';
  carbs = '';
  calorie = '';
  gender: String;
  currentUrl = '';
  fileListJson: any = [];
  trainingFilesList: any = [];
  dietName: String;
  diet: String;
  trainingName: String;
  training: String;
  showDietDetails = false;
  showTrainingDetails = false;
  targetWeightForm: FormGroup;
  paymentForm: FormGroup;
  newTrainingForm: FormGroup;
  newDietForm: FormGroup;
  dietPlanForm: FormGroup;
  newBothForm: FormGroup;
  showUpdateWeight = false;
  goalWeight = 0;
  program: String;
  dietList: any = [];
  trainingList: any = [];
  activeTrainingPlan = '';
  activeDietPlan = '';
  activeTrainingProgram = '';
  activeDietProgram = '';
  activeBothProgram = '';
  bothProgramBtnClicked = false;
  trainingProgramBtnClicked = false;
  dietProgramBtnClicked = false;
  isModalButtonClicked = false;
  showPayment = false;
  planPrice = 0;
  newPlanPrice = 0;
  recentWeight = 0;
  weightModel: WeightModel = new WeightModel();
  programModel: ProgramModel = new ProgramModel();
  dietModel: DietModel = new DietModel();
  trainingModel: TrainingModel = new TrainingModel();
  trainingAndDietModel: TrainingAndDietModel = new TrainingAndDietModel();
  message = '';
  stripeErrorMsg = '';
  category = '';
  showStripeErrorMsg = false;
  public loading = false;
  stripeModel: StripeModel = new StripeModel();
  @ViewChild('modalCloseBtn') modalCloseBtn: ElementRef;
  @ViewChild('closeDietModal') closeDietModal: ElementRef;
  @ViewChild('closeTrainingModal') closeTrainingModal: ElementRef;
  @ViewChild('dietModalCloseBtn') dietModalCloseBtn: ElementRef;
  @ViewChild('closeBothModal') closeBothModal: ElementRef;
  public userGoalWeight: Array<any> = [];
  // line charts
  public lineChartData: Array<any> = [];
  public lineChartLabels: Array<any> = [];
  public lineChartOptions: any = {
    responsive: true
  };
  public lineChartColors: Array<any> = [
    {
      // grey
      backgroundColor: 'rgba(49,104,33,0.01)',
      borderColor: 'rgba(49,104,33,1)',
      pointBackgroundColor: 'rgba(49,104,33,1)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(49,104,33,0.8)'
    },
    {
      // dark grey
      backgroundColor: 'rgba(223,99,37,0.01)',
      borderColor: 'rgba(223,99,37,1)',
      pointBackgroundColor: 'rgba(223,99,37,1)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(223,99,37,1)'
    },
    {
      // grey
      backgroundColor: 'rgba(10,21,67,0.01)',
      borderColor: 'rgba(10,21,67,1)',
      pointBackgroundColor: 'rgba(10,21,67,1)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(10,21,67,0.8)'
    }
  ];

  public doughnutChartColors: Array<any> = [
    {
      // grey
      backgroundColor: ['#DEDBE0', '#6216A0'],
      borderColor: ['#DEDBE0', '#6216A0'],
      pointBackgroundColor: ['#DEDBE0', '#6216A0'],
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(49,104,33,0.8)',
    }
  ];
  public lineChartLegend = true;
  public lineChartType = 'line';
  // doughnut charts
  public doughnutChartLabels: string[] = [];
  // public doughnutChartData: number[] = [];
  public doughnutChartData = [5, 1];
  public doughnutChartType = 'doughnut';
  constructor(
    fb: FormBuilder,
    private aboutService: AboutService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private toastr: ToastrService,
    private _zone: NgZone,
    private stripeService: StripeService,
  ) {
    this.targetWeightForm = fb.group({
      targetWeight: ['', Validators.compose([Validators.required])]
    });
    this.paymentForm = fb.group({
      trainingPerWeek: ['', Validators.compose([Validators.required])],
      cardHolderName: ['', Validators.compose([Validators.required])],
      cardNumber: ['', Validators.compose([Validators.required])],
      expiryDate: ['', Validators.compose([Validators.required])],
      cvc: ['', Validators.compose([Validators.required])]
    });
    this.newTrainingForm = fb.group({
      trainingPerWeek: ['', Validators.compose([Validators.required])],
      cardHolderName: ['', Validators.compose([Validators.required])],
      cardNumber: ['', Validators.compose([Validators.required])],
      expiryDate: ['', Validators.compose([Validators.required])],
      cvc: ['', Validators.compose([Validators.required])]
    });
    this.newDietForm = fb.group({
      dietPlan: ['', Validators.compose([Validators.required])],
      cardHolderName: ['', Validators.compose([Validators.required])],
      cardNumber: ['', Validators.compose([Validators.required])],
      expiryDate: ['', Validators.compose([Validators.required])],
      cvc: ['', Validators.compose([Validators.required])]
    });
    this.dietPlanForm = fb.group({
      dietPlan: ['', Validators.compose([Validators.required])],
      cardHolderName: ['', Validators.compose([Validators.required])],
      cardNumber: ['', Validators.compose([Validators.required])],
      expiryDate: ['', Validators.compose([Validators.required])],
      cvc: ['', Validators.compose([Validators.required])]
    });

    this.newBothForm = fb.group({
      trainingPerWeek: ['', Validators.compose([Validators.required])],
      dietPlan: ['', Validators.compose([Validators.required])],
      cardHolderName: ['', Validators.compose([Validators.required])],
      cardNumber: ['', Validators.compose([Validators.required])],
      expiryDate: ['', Validators.compose([Validators.required])],
      cvc: ['', Validators.compose([Validators.required])]
    });
  }

  ngOnInit() {
    // console.log('init called');
    if (localStorage.getItem('currentUser') === null) {
      this.router.navigate(['/']);
    }
    this.getUserProfile();
    this.getUserGoalWeight();
    this.getRecentWeight();
    this.getPlans();
    this.getDoughnutChartData();
    this.doughnutChartLabels = ['Mål Vægt', 'Opnået Vægt'];
  }

  getUserProfile() {
    const user = JSON.parse(localStorage.getItem('currentUser'));
    const token = user.token;
    this.aboutService.getUserProfile(token).subscribe(
      (data: any) => {
        this.profile = data;
        this.goalWeight = this.profile.targetWeight;
        this.aboutService.emitProfileData(JSON.stringify(this.profile));
      },
      (error: any) => {
        console.log(error);
      }
    );
  }

  getRecentWeight() {
    this.aboutService.getUserRecentWeight().subscribe(
      result => {
        this.recentWeight = JSON.parse(JSON.stringify(result)).weight;
      },
      err => {
        console.log(err);
      }
    );
  }

  getPlans() {
    this.aboutService.getPlanDetails().subscribe(
      (data: any) => {
        this.program = data.UserPlan.description;
        this.getAllProgramForAPlan();
      },
      (error: any) => {
        console.log(error);
      }
    );
  }

  getAllProgramForAPlan() {
    this.programModel.planName = this.program;
    this.aboutService.findAllPrograms(this.programModel).subscribe(
      (data: any) => {
        this.dietList = data.Diet;
        this.trainingList = data.Training;
        // console.log('diet List ', JSON.stringify(this.dietList));
        // console.log('training List ', JSON.stringify(this.trainingList));
      },
      (error: any) => {
        console.log(error);
      }
    );
  }
  getUpdatedProgramsForAPlan() {
    this.program = 'Training & Diet';
    this.aboutService.findAllPrograms(this.programModel).subscribe(
      (data: any) => {
        this.dietList = data.Diet;
        this.trainingList = data.Training;
      },
      (error: any) => {
        console.log(error);
      }
    );
  }

  getGoalWeight(data: any) {
    if (data.goal === 'Lower Body Fat') {
      this.goalWeight = data.weight - data.targetWeight;
    } else if (data.goal === 'More muscle mass') {
      this.goalWeight = data.weight + data.targetWeight;
    } else if (data.goal === 'Keep the weight') {
      this.goalWeight = data.weight;
    } else {
      this.goalWeight = data.weight;
    }
  }

  getDietFiles(calorie: String, name: String) {
    if (this.showDietDetails === false) {
      this.showDietDetails = true;
    }
    this.diet = 'diet';
    this.dietName = calorie;
    this.category = String(name);
    this.aboutService.listDietDetailsFiles(this.diet, this.dietName, name).subscribe(
      (data: any) => {
        // console.log('data ', JSON.stringify(data));
        this.fileListJson = data;
      },
      (error: any) => {
        console.log(error);
      }
    );
  }

  // getNearestCalorie(calorie: String) {
  //   const numCalorie = Number(calorie);
  //   let dirName;
  //   if (numCalorie % 50 >= 25)
  //     dirName = Math.ceil(numCalorie / 50) * 50;
  //   else
  //     dirName = Math.floor(numCalorie / 50) * 50;
  //   return String(dirName);
  // }

  getTrainingFiles(val: string) {
    if (this.showTrainingDetails === false) {
      this.showTrainingDetails = true;
    }
    this.training = 'training';
    this.trainingName = val + ' Days';
    this.aboutService
      .listTrainingDetailsFiles(this.training, this.trainingName)
      .subscribe(
        (data: any) => {
          // console.log('data ', JSON.stringify(data));
          this.trainingFilesList = data;
        },
        (error: any) => {
          console.log(error);
        }
      );
  }

  showHideTrainingDiv() {
    if (this.showTrainingDetails === false) {
      this.showTrainingDetails = true;
    } else {
      this.showTrainingDetails = false;
    }
  }

  showHideDietDiv() {
    if (this.showDietDetails === false) {
      this.showDietDetails = true;
    } else {
      this.showDietDetails = false;
    }
  }

  downloadFile(route: String, fileName: String) {
    let folder = '';
    if (route === 'training') {
      folder = String(this.trainingName);
    } else {
      folder = String(this.dietName);
    }
    this.aboutService.downloadDietFile(route, folder, fileName, this.category).subscribe(
      result => {
        // console.log('result of download file ', JSON.stringify(result));
        saveAs(result, fileName);
      },
      err => {
        console.log(err);
      }
    );
  }

  downloadTrainingFile(route: String, fileName: String) {
    let categoryName = '';
    if (route === 'training') {
      categoryName = String(this.trainingName);
    } else {
      categoryName = String(this.dietName);
    }
    // console.log('route ', route);
    // console.log('categoryName ', categoryName);
    // console.log('filename ', fileName);
    this.aboutService.downloadTrainingFile(route, categoryName, fileName).subscribe(
      result => {
        // console.log('result of download file ', JSON.stringify(result));
        saveAs(result, fileName);
      },
      err => {
        console.log(err);
      }
    );
  }

  updateWeight(form: FormGroup) {
    const weight = form.get('targetWeight').value;
    this.weightModel.weight = Number(weight);
    this.aboutService.updateWeight(this.weightModel).subscribe(
      result => {
        this.showUpdateWeight = true;
        setInterval(() => {
          window.location.reload();
        }, 2000);
      },
      err => {
        console.log(err);
      }
    );
  }

  getProgram(planName: String) {
    if (!this.isModalButtonClicked) {
      this.isModalButtonClicked = true;
      this.activeTrainingPlan = 'active';
      this.aboutService.getPlanPrice(planName).subscribe(
        (data: any) => {
          this.planPrice = data.price;
          this.getAllProgramForAPlan();
        },
        (error: any) => {
          console.log(error);
        }
      );
    } else {
      this.isModalButtonClicked = false;
      this.activeTrainingPlan = '';
    }
  }

  getDiet(planName: String) {
    if (!this.isModalButtonClicked) {
      this.isModalButtonClicked = true;
      this.activeDietPlan = 'active';
      this.aboutService.getPlanPrice(planName).subscribe(
        (data: any) => {
          this.planPrice = data.price;
          this.getAllProgramForAPlan();
        },
        (error: any) => {
          console.log(error);
        }
      );
    } else {
      this.isModalButtonClicked = false;
      this.activeDietPlan = '';
    }
  }

  getTrainingOrDietProgram(planName: String) {
    this.aboutService.getPlanPrice(planName).subscribe(
      (data: any) => {
        this.newPlanPrice = data.price;
      },
      (error: any) => {
        console.log(error);
      }
    );
  }

  buyTrainingProgram() {
    if (this.trainingProgramBtnClicked === false) {
      this.activeTrainingProgram = 'active';
      this.trainingProgramBtnClicked = true;
    } else {
      this.activeTrainingProgram = '';
      this.trainingProgramBtnClicked = false;
    }
  }

  buyDietProgram() {
    if (this.dietProgramBtnClicked === false) {
      this.activeDietProgram = 'active';
      this.dietProgramBtnClicked = true;
    } else {
      this.activeDietProgram = '';
      this.dietProgramBtnClicked = false;
    }
  }

  buyBothProgram() {
    if (this.bothProgramBtnClicked === false) {
      this.bothProgramBtnClicked = true;
      this.activeBothProgram = 'active';
    } else {
      this.bothProgramBtnClicked = false;
      this.activeBothProgram = '';
    }
 }

  async addNewDietProgram(form: FormGroup) {
    const dietPlan = form.get('dietPlan').value;
    this.dietModel.name = dietPlan;
    this.dietModel.protein = this.protein;
    this.dietModel.carbs = this.carbs;
    this.dietModel.fat = this.fat;
    this.dietModel.calorie = this.calorie;

    const cardHolderName = form.get('cardHolderName').value;
    const cardNumber = form.get('cardNumber').value;
    const expiryDate = form.get('expiryDate').value;
    const cvc = form.get('cvc').value;
    const expiryMonth = expiryDate.split('/')[0];
    const expiryYear = expiryDate.split('/')[1];
    this.loading = true;
    await (<any>window).Stripe.card.createToken({
      number: cardNumber,
      exp_month: expiryMonth,
      exp_year: expiryYear,
      cvc: cvc
    }, (status: number, response: any) => {

      // Wrapping inside the Angular zone
      this._zone.run(async () => {
        if (status === 200) {
          await this.closeDietModal.nativeElement.click();
          this.showStripeErrorMsg = false;
          this.message = response.id;
          this.stripeModel.cardHolderName = cardHolderName;
          this.stripeModel.cardNumber = cardNumber;
          this.stripeModel.expiryMonth = expiryMonth;
          this.stripeModel.expiryYear = expiryYear;
          this.stripeModel.cvc = cvc;
          this.stripeModel.token = this.message;
          this.stripeModel.amount = this.newPlanPrice;
          this.stripeService.placeStripeOrder(this.stripeModel).subscribe(
            (data: any) => {
              this.getNewDietProgram();
              this.loading = false;
            },
            (error: any) => {
              this.loading = false;
              this.toastr.error(
                'Noget gik galt, prøv venligst igen senere',
                null,
                {
                  positionClass: 'toast-top-full-width',
                  progressBar: true,
                  closeButton: true,
                  progressAnimation: 'increasing'
                }
              );
              console.log(error);
            }
          );
        } else {
          this.loading = false;
          this.showStripeErrorMsg = true;
          this.message = response.error.message;
          this.stripeErrorMsg = this.message;
        }
      });
    });
  }

  getNewDietProgram() {
    this.aboutService.buyNewDietProgram(this.dietModel).subscribe(
      (data: any) => {
        this.getAllProgramForAPlan();
        this.toastr.success('Betalingen er gennemført.', null, {
          positionClass: 'toast-top-full-width',
          progressBar: true,
          closeButton: true,
          progressAnimation: 'increasing'
        });
      },
      (error: any) => {
        this.toastr.error(
          'Noget gik galt, prøv venligst igen senere',
          null,
          {
            positionClass: 'toast-top-full-width',
            progressBar: true,
            closeButton: true,
            progressAnimation: 'increasing'
          }
        );
        console.log(error);
      }
    );
  }

  async addNewTrainingProgram(form: FormGroup) {
    const trainingPerWeek = form.get('trainingPerWeek').value;
    const cardHolderName = form.get('cardHolderName').value;
    const cardNumber = form.get('cardNumber').value;
    const expiryDate = form.get('expiryDate').value;
    const cvc = form.get('cvc').value;
    const expiryMonth = expiryDate.split('/')[0];
    const expiryYear = expiryDate.split('/')[1];

    this.trainingModel.name = trainingPerWeek;
    this.loading = true;
    await (<any>window).Stripe.card.createToken({
      number: cardNumber,
      exp_month: expiryMonth,
      exp_year: expiryYear,
      cvc: cvc
    }, (status: number, response: any) => {

      // Wrapping inside the Angular zone
      this._zone.run(async () => {
        if (status === 200) {
          await this.closeTrainingModal.nativeElement.click();
          this.showStripeErrorMsg = false;
          this.message = response.id;
          this.stripeModel.cardHolderName = cardHolderName;
          this.stripeModel.cardNumber = cardNumber;
          this.stripeModel.expiryMonth = expiryMonth;
          this.stripeModel.expiryYear = expiryYear;
          this.stripeModel.cvc = cvc;
          this.stripeModel.token = this.message;
          this.stripeModel.amount = this.newPlanPrice;
          this.stripeService.placeStripeOrder(this.stripeModel).subscribe(
            (data: any) => {
              this.loading = false;
              this.getNewTrainingProgram();
            },
            (error: any) => {
              this.loading = false;
              this.toastr.error(
                'Noget gik galt, prøv venligst igen senere',
                null,
                {
                  positionClass: 'toast-top-full-width',
                  progressBar: true,
                  closeButton: true,
                  progressAnimation: 'increasing'
                }
              );
              console.log(error);
            }
          );
        } else {
          this.loading = false;
          this.showStripeErrorMsg = true;
          this.message = response.error.message;
          this.stripeErrorMsg = this.message;
        }
      });
    });
  }

  getNewTrainingProgram() {
    this.aboutService.buyNewTrainingProgram(this.trainingModel).subscribe(
      (data: any) => {
        this.getAllProgramForAPlan();
        this.toastr.success('Betalingen er gennemført.', null, {
          positionClass: 'toast-top-full-width',
          progressBar: true,
          closeButton: true,
          progressAnimation: 'increasing'
        });
      },
      (error: any) => {
        this.toastr.error(
          'Noget gik galt, prøv venligst igen senere',
          null,
          {
            positionClass: 'toast-top-full-width',
            progressBar: true,
            closeButton: true,
            progressAnimation: 'increasing'
          }
        );
        console.log(error);
      }
    );
  }

  getBothPrograms() {
    this.aboutService.buyBothPrograms(this.trainingAndDietModel).subscribe(
      (data: any) => {
        this.program = 'Training & Diet';
        this.getAllProgramForAPlan();
        this.toastr.success('Betalingen er gennemført.', null, {
          positionClass: 'toast-top-full-width',
          progressBar: true,
          closeButton: true,
          progressAnimation: 'increasing'
        });
      },
      (error: any) => {
        this.toastr.error(
          'Noget gik galt, prøv venligst igen senere',
          null,
          {
            positionClass: 'toast-top-full-width',
            progressBar: true,
            closeButton: true,
            progressAnimation: 'increasing'
          }
        );
        console.log(error);
      }
    );
  }

  async addNewBothProgram(form: FormGroup) {
    const trainingPerWeek = form.get('trainingPerWeek').value;
    const dietPlan = form.get('dietPlan').value;
    const cardHolderName = form.get('cardHolderName').value;
    const cardNumber = form.get('cardNumber').value;
    const expiryDate = form.get('expiryDate').value;
    const cvc = form.get('cvc').value;
    const expiryMonth = expiryDate.split('/')[0];
    const expiryYear = expiryDate.split('/')[1];

    this.trainingAndDietModel.dietPlan = dietPlan;
    this.trainingAndDietModel.trainingPerWeek = trainingPerWeek;
    this.trainingAndDietModel.protein = this.protein;
    this.trainingAndDietModel.carbs = this.carbs;
    this.trainingAndDietModel.fat = this.fat;
    this.trainingAndDietModel.calorie = this.calorie;

    this.loading = true;
    await (<any>window).Stripe.card.createToken({
      number: cardNumber,
      exp_month: expiryMonth,
      exp_year: expiryYear,
      cvc: cvc
    }, (status: number, response: any) => {

      // Wrapping inside the Angular zone
      this._zone.run(async () => {
        if (status === 200) {
          await this.closeBothModal.nativeElement.click();
          this.showStripeErrorMsg = false;
          this.message = response.id;
          this.stripeModel.cardHolderName = cardHolderName;
          this.stripeModel.cardNumber = cardNumber;
          this.stripeModel.expiryMonth = expiryMonth;
          this.stripeModel.expiryYear = expiryYear;
          this.stripeModel.cvc = cvc;
          this.stripeModel.token = this.message;
          this.stripeModel.amount = this.newPlanPrice;
          this.stripeService.placeStripeOrder(this.stripeModel).subscribe(
            (data: any) => {
              this.loading = false;
              this.getBothPrograms();
            },
            (error: any) => {
              this.loading = false;
              console.log(error);
            }
          );
        } else {
          this.loading = false;
          this.showStripeErrorMsg = true;
          this.message = response.error.message;
          this.stripeErrorMsg = this.message;
        }
      });
    });
  }

  showPaymentDiv() {
    if (!this.showPayment) {
      this.showPayment = true;
    } else {
      this.showPayment = false;
    }
  }

  // async updateToTrainingPlan(form: FormGroup) {
  //   this.trainingModel.name = form.get('trainingPerWeek').value;
  //   const cardHolderName = form.get('cardHolderName').value;
  //   const cardNumber = form.get('cardNumber').value;
  //   const expiryDate = form.get('expiryDate').value;
  //   const cvc = form.get('cvc').value;
  //   const expiryMonth = expiryDate.split('/')[0];
  //   const expiryYear = expiryDate.split('/')[1];

  //   this.loading = true;
  //   await (<any>window).Stripe.card.createToken({
  //     number: cardNumber,
  //     exp_month: expiryMonth,
  //     exp_year: expiryYear,
  //     cvc: cvc
  //   }, (status: number, response: any) => {

  //     // Wrapping inside the Angular zone
  //     this._zone.run(async () => {
  //       if (status === 200) {
  //         await this.modalCloseBtn.nativeElement.click();
  //         this.showStripeErrorMsg = false;
  //         this.message = response.id;
  //         this.stripeModel.cardHolderName = cardHolderName;
  //         this.stripeModel.cardNumber = cardNumber;
  //         this.stripeModel.expiryMonth = expiryMonth;
  //         this.stripeModel.expiryYear = expiryYear;
  //         this.stripeModel.cvc = cvc;
  //         this.stripeModel.token = this.message;
  //         this.stripeModel.amount = this.newPlanPrice;
  //         this.stripeService.placeStripeOrder(this.stripeModel).subscribe(
  //           (data: any) => {
  //             this.loading = false;
  //             this.updateToNewTrainingPlan();
  //           },
  //           (error: any) => {
  //             this.loading = false;
  //             console.log(error);
  //           }
  //         );
  //       } else {
  //         this.loading = false;
  //         this.showStripeErrorMsg = true;
  //         this.message = response.error.message;
  //         this.stripeErrorMsg = this.message;
  //       }
  //     });
  //   });
  // }

  // async updateToNewTrainingPlan() {
  //   this.aboutService.updateToTrainingPlan(this.trainingModel).subscribe(
  //     (result) => {
  //       this.getUpdatedProgramsForAPlan();
  //       this.toastr.success('betalingen er gennemført.', null, {
  //         positionClass: 'toast-top-full-width',
  //         progressBar: true,
  //         closeButton: true,
  //         progressAnimation: 'increasing'
  //       });
  //     },
  //     err => {
  //       this.toastr.error(
  //         'Noget gik galt, prøv venligst igen senere',
  //         null,
  //         {
  //           positionClass: 'toast-top-full-width',
  //           progressBar: true,
  //           closeButton: true,
  //           progressAnimation: 'increasing'
  //         }
  //       );
  //       console.log(err);
  //     }
  //   );
  // }

  // async updateToDietPlan(form: FormGroup) {
  //   this.dietModel.name = form.get('dietPlan').value;
  //   this.dietModel.protein = this.protein;
  //   this.dietModel.carbs = this.carbs;
  //   this.dietModel.fat = this.fat;
  //   this.dietModel.calorie = this.calorie;
  //   const cardHolderName = form.get('cardHolderName').value;
  //   const cardNumber = form.get('cardNumber').value;
  //   const expiryDate = form.get('expiryDate').value;
  //   const cvc = form.get('cvc').value;
  //   const expiryMonth = expiryDate.split('/')[0];
  //   const expiryYear = expiryDate.split('/')[1];

  //   this.loading = true;
  //   await (<any>window).Stripe.card.createToken({
  //     number: cardNumber,
  //     exp_month: expiryMonth,
  //     exp_year: expiryYear,
  //     cvc: cvc
  //   }, (status: number, response: any) => {

  //     // Wrapping inside the Angular zone
  //     this._zone.run(async () => {
  //       if (status === 200) {
  //         await this.dietModalCloseBtn.nativeElement.click();
  //         this.showStripeErrorMsg = false;
  //         this.message = response.id;
  //         this.stripeModel.cardHolderName = cardHolderName;
  //         this.stripeModel.cardNumber = cardNumber;
  //         this.stripeModel.expiryMonth = expiryMonth;
  //         this.stripeModel.expiryYear = expiryYear;
  //         this.stripeModel.cvc = cvc;
  //         this.stripeModel.token = this.message;
  //         this.stripeModel.amount = this.newPlanPrice;
  //         this.stripeService.placeStripeOrder(this.stripeModel).subscribe(
  //           (data: any) => {
  //             this.loading = false;
  //             this.updateToNewDietPlan();
  //           },
  //           (error: any) => {
  //             this.loading = false;
  //             console.log(error);
  //           }
  //         );
  //       } else {
  //         this.loading = false;
  //         this.showStripeErrorMsg = true;
  //         this.message = response.error.message;
  //         this.stripeErrorMsg = this.message;
  //       }
  //     });
  //   });
  // }

  // async updateToNewDietPlan() {
  //   this.aboutService.updateToDietPlan(this.dietModel).subscribe(
  //     result => {
  //       this.getUpdatedProgramsForAPlan();
  //       this.toastr.success('betalingen er gennemført.', null, {
  //         positionClass: 'toast-top-full-width',
  //         progressBar: true,
  //         closeButton: true,
  //         progressAnimation: 'increasing'
  //       });
  //     },
  //     err => {
  //       this.toastr.error(
  //         'Noget gik galt, prøv venligst igen senere.',
  //         null,
  //         {
  //           positionClass: 'toast-top-full-width',
  //           progressBar: true,
  //           closeButton: true,
  //           progressAnimation: 'increasing'
  //         }
  //       );
  //       console.log(err);
  //     }
  //   );
  // }

  getUserGoalWeight() {
    this.aboutService.getUserGoalWeight().subscribe(
      (data: any) => {
        // console.log('data ', JSON.stringify(data));
        this.userGoalWeight = JSON.parse(JSON.stringify(data.data));
        // this.userGoalWeight = [66, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        this.lineChartData.push(
          { data: this.userGoalWeight, label: 'Mål Vægt (kg)' },
        );
        this.lineChartLabels = data.month;
      },
      err => {
        console.log(err);
      }
    );
  }

  getDoughnutChartData() {
    const user = JSON.parse(localStorage.getItem('currentUser'));
    const token = user.token;
    this.aboutService.getUserProfile(token).subscribe(
      (data: any) => {
        this.profile = data;
        let targetWeight = this.profile.targetWeight;
        let acheivedWeight = this.profile.weight - this.recentWeight;
        if (this.profile.goal === 'Lavere Fedtprocent') {
          acheivedWeight = this.profile.weight - this.recentWeight;
        } else if (this.profile.goal === 'Mere Muskelmasse') {
          acheivedWeight = this.recentWeight - this.profile.weight;
        } else {
          targetWeight = 0;
          acheivedWeight = 0;
        }
        // this.doughnutChartData = [5, 1];
        this.doughnutChartData = [targetWeight, acheivedWeight];
      },
      (error: any) => {
        console.log(error);
      }
    );
  }
}
