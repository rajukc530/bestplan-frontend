import { Component, OnInit, HostListener, ElementRef, ViewChild, } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoginModel } from '../../model/login.model';
import { NavbarService } from '../navbar/navbar.service';
import { Router, NavigationEnd } from '@angular/router';
import { HomeService } from '../../home/home.service';
import { AboutService } from '../../about/about.service';
/**
 * This class represents the navigation bar component.
 */
@Component({
  moduleId: module.id,
  selector: 'sd-navbar',
  templateUrl: 'navbar.component.html',
  styleUrls: ['navbar.component.css']
})
export class NavbarComponent implements OnInit {
  isModalButtonClicked = false;
  activeClass = '';
  loginForm: FormGroup;
  isNavClicked = false;
  navClass = '';
  toggleClass = '';
  offSetScroll: number;
  loginError: boolean;
  currentUser = '';
  loginModel: LoginModel = new LoginModel();
  isLoggedIn = false;
  currentUrl = '';
  @ViewChild('closeModalBtn') closeModalBtn: ElementRef;

  constructor(
    fb: FormBuilder,
    private navService: NavbarService,
    private router: Router,
    private homeService: HomeService,
    private aboutService: AboutService,
  ) {
    this.router.events.subscribe(
      (event: any) => {
        if (event instanceof NavigationEnd) {
          // console.log('this.router.url', this.router.url);
          this.currentUrl = this.router.url;
        }
      }
    );
    this.loginForm = fb.group({
      email: ['', Validators.compose([Validators.required])],
      password: ['', Validators.compose([Validators.required])]
    });
  }

  ngOnInit() {
    if (localStorage.getItem('currentUser') !== null) {
      this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
      this.isLoggedIn = true;
    }
    // this.homeService.userProfile.subscribe(
    //   (item: any) => (this.currentUser = item)
    // );
    this.navService.userProfile.subscribe(
      (item: any) => (this.isLoggedIn = item)
    );
    this.aboutService.userProfile.subscribe(
      (item: any) => (this.currentUser = JSON.parse(item))
    );
    // this.navService.setCurrentURL(this.currentUrl);
  }

  clickOpenModalBtn() {
    if (!this.isModalButtonClicked) {
      this.isModalButtonClicked = true;
      this.activeClass = 'active';
    } else {
      this.isModalButtonClicked = false;
      this.activeClass = '';
    }
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

  @HostListener('window:scroll', ['$event'])
  onScroll() {
    this.offSetScroll = window.pageYOffset;
  }

  /**
   *
   * @param loginForm
   */
  doLogin(loginForm: FormGroup) {
    const username = loginForm.get('email').value;
    const password = loginForm.get('password').value;
    this.loginModel.username = username;
    this.loginModel.password = password;
    this.navService.doLogin(this.loginModel).subscribe(
      (data: any) => {
        if (data.username) {
          localStorage.setItem(
            'currentUser',
            JSON.stringify({
              email: data.username,
              token: data.token,
              firstName: data.firstName,
              lastName: data.lastName,
              roleId: data.role,
              plan: data.plan
            })
          );
          this.navService.emitCurrentUser();
          this.loginForm.reset();
          this.closeModalBtn.nativeElement.click();
          this.clickNavIcon();
          this.router.navigate(['profile']);
        } else {
          this.loginError = true;
        }
      },
      (error: any) => {
        console.log(error);
      }
    );
  }

  doLogout() {
    this.isLoggedIn = false;
    this.navService.emitLoggOutStatus(this.isLoggedIn);
    this.clickNavIcon();
    localStorage.removeItem('currentUser');
    this.router.navigate(['/']);
  }
}
