import { Component, ElementRef, ViewChild, OnInit, NgZone } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CustomValidators } from '../customvalidator/customvalidators.component';
import { HomeService } from './home.service';
import { Modal } from '../model/modal';
import { Options, ChangeContext } from 'ng5-slider';
import { INgxMyDpOptions } from 'ngx-mydatepicker';
import { ToastrService } from 'ngx-toastr';
import { PageVisitModel } from '../model/pageVisit.model';
import { StripeModel } from '../model/stripe.model';
import { StripeService } from '../stripe/stripe.service';

/**
 * This class represents the lazy loaded HomeComponent.
 */
@Component({
  moduleId: module.id,
  selector: 'sd-home',
  templateUrl: 'home.component.html',
  styleUrls: ['home.component.css']
})
export class HomeComponent implements OnInit {
  activeClass = '';
  currentClass = 'current';
  tabs = 'tabs-disabled';
  showOrHideInformationTab = '';
  showOrHideInsightTab = '';
  showOrHideTrainingTab = '';
  showOrHideDoneTab = '';
  informationTab = '';
  insightTab = '';
  trainingTab = '';
  doneTab = '';
  planName = '';
  planPrice = 0;
  goalWeight = 0;
  isLoggedIn = false;
  public loading = false;

  value = 1.3;
  options: Options = {
    floor: 1.3,
    ceil: 2.7,
    step: 0.1,
    showTicks: true
  };

  myOptions: INgxMyDpOptions = {
    // other options...
    dateFormat: 'dd.mm.yyyy'
  };

  // Initialized to specific date (09.10.2018)
  model: any = { jsdate: new Date() };

  isModalButtonClicked = false;
  modal: Modal = new Modal();

  informationForm: FormGroup;
  insightForm: FormGroup;
  trainingForm: FormGroup;
  paymentForm: FormGroup;
  newBothForm: FormGroup;
  @ViewChild('modalCloseBtn') modalCloseBtn: ElementRef;
  logText: String;
  showPayment = false;
  goalText = '';
  showGoalField = false;
  userAge = 0;
  protein = 0;
  carbs = 0;
  fat = 0;
  calorie = 0;
  trainingPerWeek = 0;
  message = '';
  stripeErrorMsg = '';
  showStripeErrorMsg = false;
  pageVisitModel: PageVisitModel = new PageVisitModel();
  stripeModel: StripeModel = new StripeModel();
  private passwordMinLength = 8;

  constructor(
    fb: FormBuilder,
    private homeService: HomeService,
    private toastr: ToastrService,
    private _zone: NgZone,
    private stripeService: StripeService,
  ) {
    this.informationForm = fb.group(
      {
        firstname: ['', Validators.compose([Validators.required])],
        lastname: ['', Validators.compose([Validators.required])],
        password: [
          '',
          Validators.compose([
            Validators.required,
            Validators.minLength(this.passwordMinLength)
          ])
        ],
        confirm_password: [
          '',
          Validators.compose([
            Validators.required,
            Validators.minLength(this.passwordMinLength)
          ])
        ],
        dob: ['', Validators.compose([Validators.required])],
        gender: ['', Validators.compose([Validators.required])],
        email: [
          '',
          Validators.compose([Validators.required, Validators.email])
        ],
        phoneNo: ['', Validators.compose([Validators.required])]
      },
      {
        validator: CustomValidators.passwordsShouldMatch
      }
    );

    this.insightForm = fb.group({
      goal: ['', Validators.compose([Validators.required])],
      targetWeight: ['', Validators.compose([Validators.required])],
      height: ['', Validators.compose([Validators.required])],
      weight: ['', Validators.compose([Validators.required])],
      calorie: ['']
    });

    this.trainingForm = fb.group({
      trainingPerWeek: [''],
      dietPlan: ['']
    });

    this.paymentForm = fb.group({
      cardHolderName: ['', Validators.compose([Validators.required])],
      cardNumber: ['', Validators.compose([Validators.required])],
      expiryDate: ['', Validators.compose([Validators.required])],
      cvc: ['', Validators.compose([Validators.required])]
    });
  }

  ngOnInit() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (currentUser) {
      this.isLoggedIn = true;
    }
    this.informationTab = 'current';
    this.insightTab = 'tabs-disabled';
    this.trainingTab = 'tabs-disabled';
    this.doneTab = 'tabs-disabled';
    this.showOrHideInformationTab = '';
    this.showOrHideInsightTab = 'hide-div';
    this.showOrHideTrainingTab = 'hide-div';
    this.showOrHideDoneTab = 'hide-div';
    this.addToPageVisits();
  }

  onUserChange(changeContext: ChangeContext): void {
    this.getChangeContextString(changeContext);
  }

  getChangeContextString(changeContext: ChangeContext) {
    const value = changeContext.value;
    this.logText = 'Meget sidestillende arbejde. Ingen, eller meget lidt fysisk aktivitet i fritiden.';
    if (
      Number(value) === 1.3 ||
      Number(value) === 1.4 ||
      Number(value) === 1.5
    ) {
      this.logText =
        'Meget sidestillende arbejde. Ingen, eller meget lidt fysisk aktivitet i fritiden.';
    }
    if (
      Number(value) === 1.6 ||
      Number(value) === 1.7 ||
      Number(value) === 1.8
    ) {
      this.logText =
        'Sidestillende arbejde med lidt fysisk aktivitet. Lidt fysisk aktivitet i fritiden.';
    }
    if (
      Number(value) === 1.9 ||
      Number(value) === 2.0 ||
      Number(value) === 2.1
    ) {
      this.logText =
        'Fysisk aktivitet kan svare til en times gå tur i rask tempo dagligt.';
    }
    if (
      Number(value) === 2.2 ||
      Number(value) === 2.3 ||
      Number(value) === 2.4
    ) {
      this.logText =
        'Fysisk hårdt arbejde og regelmæssig aktivitet i fritiden.';
    }
    if (
      Number(value) === 2.5 ||
      Number(value) === 2.6 ||
      Number(value) === 2.7
    ) {
      this.logText =
        'Fysisk hårdt arbejde og meget fysisk aktivitet i fritiden.';
    }
  }

  clickOpenModalBtn(planName: String) {
    this.planName = String(planName);
    if (!this.isModalButtonClicked) {
      this.isModalButtonClicked = true;
      this.activeClass = 'active';
    } else {
      this.isModalButtonClicked = false;
      this.activeClass = '';
    }
  }

  showPaymentDiv() {
    if (!this.showPayment) {
      this.showPayment = true;
    } else {
      this.showPayment = false;
    }
  }

  progressInfo(nextTab: String) {
    if (nextTab === 'Information') {
      this.informationTab = 'current';
      this.insightTab = 'tabs-disabled';
      this.trainingTab = 'tabs-disabled';
      this.doneTab = 'tabs-disabled';
      this.showOrHideInformationTab = '';
      this.showOrHideInsightTab = 'hide-div';
      this.showOrHideTrainingTab = 'hide-div';
      this.showOrHideDoneTab = 'hide-div';
    }
    if (nextTab === 'Insight') {
      this.informationTab = 'tabs-disabled';
      this.insightTab = 'current';
      this.trainingTab = 'tabs-disabled';
      this.doneTab = 'tabs-disabled';
      this.showOrHideInformationTab = 'hide-div';
      this.showOrHideInsightTab = '';
      this.showOrHideTrainingTab = 'hide-div';
      this.showOrHideDoneTab = 'hide-div';
    }
    if (nextTab === 'Training') {
      this.informationTab = 'tabs-disabled';
      this.insightTab = 'tabs-disabled';
      this.trainingTab = 'current';
      this.doneTab = 'tabs-disabled';
      this.showOrHideInformationTab = 'hide-div';
      this.showOrHideInsightTab = 'hide-div';
      this.showOrHideTrainingTab = '';
      this.showOrHideDoneTab = 'hide-div';
    }
    if (nextTab === 'Done') {
      this.informationTab = 'tabs-disabled';
      this.insightTab = 'tabs-disabled';
      this.trainingTab = 'tabs-disabled';
      this.doneTab = 'current';
      this.showOrHideInformationTab = 'hide-div';
      this.showOrHideInsightTab = 'hide-div';
      this.showOrHideTrainingTab = 'hide-div';
      this.showOrHideDoneTab = '';
    }
  }

  submitInformation(form: FormGroup) {
    this.modal.firstName = form.get('firstname').value;
    this.modal.lastName = form.get('lastname').value;
    this.modal.email = form.get('email').value;
    this.modal.password = form.get('password').value;
    const dob = form.get('dob').value;
    this.modal.dob = dob.formatted;
    this.modal.gender = form.get('gender').value;
    this.modal.phoneNo = form.get('phoneNo').value;
  }

  submitInsight(form: FormGroup) {
    this.modal.goal = form.get('goal').value;
    this.modal.targetWeight = form.get('targetWeight').value;
    this.modal.height = form.get('height').value;
    this.modal.weight = form.get('weight').value;
    this.modal.pal = this.value;
    this.findMacroNutrients();
  }

  submitTraining(form: FormGroup) {
    this.modal.trainingPerWeek = form.get('trainingPerWeek').value;
    this.modal.dietPlan = form.get('dietPlan').value;
    this.homeService.getPlanPrice(this.planName).subscribe(
      (data: any) => {
        this.planPrice = data.price;
        this.modal.planId = data.id;
        this.modal.planName = data.name;
      },
      (error: any) => {
        console.log(error);
      }
    );
    // console.log('model information ', JSON.stringify(this.modal));
  }

  async proceedPayment(form: FormGroup) {
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
          await this.modalCloseBtn.nativeElement.click();
          this.showStripeErrorMsg = false;
          this.message = response.id;
          this.stripeModel.cardHolderName = this.modal.email;
          this.stripeModel.cardNumber = cardNumber;
          this.stripeModel.expiryMonth = expiryMonth;
          this.stripeModel.expiryYear = expiryYear;
          this.stripeModel.cvc = cvc;
          this.stripeModel.token = this.message;
          this.stripeModel.amount = this.planPrice;
          this.stripeService.placeStripeOrder(this.stripeModel).subscribe(
            (data: any) => {
              this.placeOrder();
              this.loading = false;
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
    // this.placeOrder();
  }

  getGoalWeight() {
    if (this.modal.goal === 'Lower Body Fat') {
      this.goalWeight = this.modal.weight - this.modal.targetWeight;
    } else if (this.modal.goal === 'More muscle mass') {
      this.goalWeight = this.modal.weight + this.modal.targetWeight;
    } else if (this.modal.goal === 'Keep the weight') {
      this.goalWeight = this.modal.weight;
    } else {
      this.goalWeight = this.modal.weight;
    }
  }

  findMacroNutrients() {
    const dob = this.modal.dob;
    const tempDob: any[] = dob.split('.');
    const year = tempDob[2];
    const month = tempDob[1];
    const day = tempDob[0];
    const date = new Date(year, month, day);
    this.userAge = this.calculateAge(date);
    this.calcuateCalorie();
    this.caluclateMacros(this.calorie);
  }

  calculateAge(birthday: Date) {
    // birthday is a date
    const ageDifMs = Date.now() - new Date(String(birthday)).getTime();
    const ageDate = new Date(ageDifMs); // miliseconds from epoch
    return Math.abs(ageDate.getUTCFullYear() - 1970);
  }

  calcuateCalorie() {
    if (this.modal.gender === 'Male') {
      this.calorie = Math.round(
        (this.modal.weight * 10 + this.modal.height * 6.25 - 5 * this.userAge + 5) *
        this.modal.pal
      );
    } else {
      this.calorie = Math.round(
        (this.modal.weight * 10 +
          this.modal.height * 6.25 -
          5 * this.userAge -
          161) *
          this.modal.pal
      );
    }
    return this.calorie;
  }

  caluclateMacros(calorie: number) {
    // User doesn't know his BF
    const lbs = this.modal.weight * 2.2;
    if (this.modal.goal === 'Lower Body Fat') {
      // Lose bf.
      calorie = calorie - 500;
      this.protein = lbs * 0.8;
      this.fat = lbs * 0.35;
      this.carbs = (calorie - this.protein * 4 - this.fat * 9) / 4;
    } else if (this.modal.goal === 'More muscle mass') {
      // Muscle gain
      calorie = calorie + 250;
      this.protein = lbs * 0.7;
      this.fat = (calorie * 0.25) / 9;
      this.carbs = (calorie - this.protein * 4 - this.fat * 9) / 4;
    } else {
      // mainteance
      calorie = calorie + 0;
      this.protein = lbs * 0.9;
      this.fat = lbs * 0.4;
      this.carbs = (calorie - this.protein * 4 - this.fat * 9) / 4;
    }

    this.protein = Math.round(this.protein);
    this.carbs = Math.round(this.carbs);
    this.fat = Math.round(this.fat);
    // this.planName = String(this.modal.goal);
    // this.trainingPerWeek = Number(this.modal.trainingPerWeek);
    this.modal.protein = String(this.protein);
    this.modal.carbs = String(this.carbs);
    this.modal.fat = String(this.fat);
    this.modal.calorie = String(this.calorie);

  }

  placeOrder() {
    this.homeService.placeOrder(this.modal).subscribe(
      (data: any) => {
        this.toastr.success('Betalingen er gennemført.', null, {
          positionClass: 'toast-top-full-width',
          progressBar: true,
          closeButton: true,
          progressAnimation: 'increasing'
        });
        this.informationForm.reset();
        this.insightForm.reset();
        this.trainingForm.reset();
        setInterval(() => {
          window.location.reload();
        }, 4000);
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

  setDate(): void {
    // Set today date using the patchValue function
    const date = new Date();
    this.informationForm.patchValue({
      myDate: {
        date: {
          year: date.getFullYear(),
          month: date.getMonth() + 1,
          day: date.getDate()
        }
      }
    });
  }

  clearDate(): void {
    // Clear the date using the patchValue function
    this.informationForm.patchValue({ myDate: null });
  }

  addToPageVisits() {
    this.pageVisitModel.page = 'Landing Page';
    this.homeService.addToPageVisits(this.pageVisitModel).subscribe(
      (data: any) => {
        // this.newUsers = data;
      },
      (error: any) => {
        console.log(error);
      }
    );
  }

  addInputField(value: string) {
    if (value === 'more muscle mass') {
      this.goalText = 'Jeg vil gerne tage på';
    } else if (value === 'lower body fat') {
      this.goalText = 'Jeg vil gerne tabe mig';
    } else if (value === 'keep the weight') {
      this.goalText = 'Jeg vil gerne holde vægten';
    }
    if (this.showGoalField === false) {
      this.showGoalField = true;
    }
  }
}
