import { Component, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ShopService } from 'app/entities/shop/service/shop.service';
import { AccountService } from 'app/core/auth/account.service';
import { AlertError } from 'app/shared/alert/alert-error.model';
import dayjs from 'dayjs/esm';
import { LoginService } from 'app/login/login.service';
import { DataUtils, FileLoadError } from 'app/core/util/data-util.service';
import { EventManager, EventWithContent } from 'app/core/util/event-manager.service';

import { EMAIL_ALREADY_USED_TYPE, LOGIN_ALREADY_USED_TYPE } from 'app/config/error.constants';
import { RegisterService } from './register.service';
import { UserDataService } from './userData.service';

interface UUser {
  id: number;
  login: string;
}

export interface SShop {
  shopName?: string | null;
  contactNum?: string | null;
  shopEmail?: string | null;
  charityShopId?: string | null;
  openHoursWeekdays?: string | null;
  openHoursWeekends?: string | null;
  openHoursHolidays?: string | null;
  street?: string | null;
  city?: string | null;
  postCode?: string | null;
  country?: string | null;
  creationDate?: dayjs.Dayjs | null | undefined;
  logo?: string | null;
  logoContentType?: string | null;
  rating?: number | null;
  distance?: number | null;
  duration?: string | null;
  user?: UUser | null;
}

type ShopFormGroupContent = {
  shopName: FormControl<SShop['shopName']>;
  contactNum: FormControl<SShop['contactNum']>;
  shopEmail: FormControl<SShop['shopEmail']>;
  charityShopId: FormControl<SShop['charityShopId']>;
  openHoursWeekdays: FormControl<SShop['openHoursWeekdays']>;
  openHoursWeekends: FormControl<SShop['openHoursWeekends']>;
  openHoursHolidays: FormControl<SShop['openHoursHolidays']>;
  street: FormControl<SShop['street']>;
  city: FormControl<SShop['city']>;
  postCode: FormControl<SShop['postCode']>;
  country: FormControl<SShop['country']>;
  creationDate: FormControl<SShop['creationDate']>;
  logo: FormControl<SShop['logo']>;
  logoContentType: FormControl<SShop['logoContentType']>;
  rating: FormControl<SShop['rating']>;
  distance: FormControl<SShop['distance']>;
  duration: FormControl<SShop['duration']>;
  user: FormControl<SShop['user']>;
};

@Component({
  selector: 'jhi-register',
  templateUrl: './register.component.html',
  styleUrls: ['register.component.scss'],
})
export class RegisterComponent implements AfterViewInit {
  @ViewChild('login', { static: false })
  login?: ElementRef;

  doNotMatch = false;
  error = false;
  errorEmailExists = false;
  errorUserExists = false;
  success = false;
  selectedRole: 'customer' | 'shopkeeper' | null = null;
  shopSubmitted = false;
  submitted = false;

  registerForm = new FormGroup({
    login: new FormControl('', {
      nonNullable: true,
      validators: [
        Validators.required,
        Validators.minLength(1),
        Validators.maxLength(50),
        Validators.pattern('^[a-zA-Z0-9!$&*+=?^_`{|}~.-]+@[a-zA-Z0-9-]+(?:\\.[a-zA-Z0-9-]+)*$|^[_.@A-Za-z0-9-]+$'),
      ],
    }),
    email: new FormControl('', {
      validators: [Validators.minLength(5), Validators.maxLength(254), Validators.email],
    }),
    password: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(4), Validators.maxLength(50)],
    }),
    confirmPassword: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(4), Validators.maxLength(50)],
    }),
  });

  shopregisterForm = new FormGroup<ShopFormGroupContent>({
    shopName: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    contactNum: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.pattern('^[0-9+0]+$')],
    }),
    shopEmail: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(5), Validators.maxLength(254), Validators.email],
    }),
    charityShopId: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    openHoursWeekdays: new FormControl('', { nonNullable: true }),
    openHoursWeekends: new FormControl('', { nonNullable: true }),
    openHoursHolidays: new FormControl('', { nonNullable: true }),
    street: new FormControl('', { nonNullable: true }),
    city: new FormControl('', { nonNullable: true }),
    postCode: new FormControl('', {
      validators: [Validators.required],
    }),
    country: new FormControl(''),
    creationDate: new FormControl(null),
    logo: new FormControl(''),
    logoContentType: new FormControl(''),
    rating: new FormControl({ value: null, disabled: true }),
    distance: new FormControl({ value: null, disabled: true }),
    duration: new FormControl({ value: null, disabled: true }),
    user: new FormControl(null),
  });

  constructor(
    private registerService: RegisterService,
    private shopService: ShopService,
    private accountService: AccountService,
    private dataUtils: DataUtils,
    private eventManager: EventManager,
    private elementRef: ElementRef,
    private loginService: LoginService,
    private router: Router,
    private UserDataService: UserDataService
  ) {}

  ngAfterViewInit(): void {
    if (this.login) {
      this.login.nativeElement.focus();
    }
  }

  byteSize(base64String: string): string {
    return this.dataUtils.byteSize(base64String);
  }

  openFile(base64String: string, contentType: string | null | undefined): void {
    this.dataUtils.openFile(base64String, contentType);
  }

  setFileData(event: Event, field: string, isImage: boolean): void {
    this.dataUtils.loadFileToForm(event, this.shopregisterForm, field, isImage).subscribe({
      error: (err: FileLoadError) =>
        this.eventManager.broadcast(new EventWithContent<AlertError>('teamprojectApp.error', { message: err.message })),
    });
  }

  clearInputImage(field: string, fieldContentType: string, idInput: string): void {
    this.shopregisterForm.patchValue({
      [field]: null,
      [fieldContentType]: null,
    });
    if (idInput && this.elementRef.nativeElement.querySelector('#' + idInput)) {
      this.elementRef.nativeElement.querySelector('#' + idInput).value = null;
    }
  }

  selectRole(role: 'customer' | 'shopkeeper'): void {
    this.selectedRole = role;
  }

  changeRole(): void {
    this.selectedRole = null;
    // reset form?
  }

  register(): void {
    this.doNotMatch = false;
    this.error = false;
    this.errorEmailExists = false;
    this.errorUserExists = false;

    const { password, confirmPassword } = this.registerForm.getRawValue();
    if (password !== confirmPassword) {
      this.doNotMatch = true;
    } else if (this.selectedRole === 'customer') {
      const { login, email } = this.registerForm.getRawValue();
      this.registerService.save({ login, email, password, langKey: 'en', shopRole: false }).subscribe({
        next: () => {
          this.success = true;
          this.router.navigate(['/login']);
        },
        error: response => this.processError(response),
      });
      this.UserDataService.setUsername(login);
    } else if (this.selectedRole === 'shopkeeper') {
      const { login, email } = this.registerForm.getRawValue();
      this.registerService.save({ login, email, password, langKey: 'en', shopRole: true }).subscribe({
        next: () => {
          this.success = true;
          const username = this.registerForm.get('login');
          if (username) {
            this.loginService.login({ username: username.value, password, rememberMe: false }).subscribe({
              next: () => {
                this.shopSubmitted = true;
              },
            });
          }
        },
        error: response => this.processError(response),
      });
    }
  }

  shopRegister(): void {
    this.error = false;
    const email = this.registerForm.get('email');
    const user = this.registerForm.get('login');
    if (user) {
      this.accountService.getUserIdByLogin(user.value).subscribe(userId => {
        if (userId !== null) {
          if (email) {
            this.shopregisterForm.patchValue({
              shopEmail: email.value,
              country: 'United Kingdom',
              user: {
                id: userId,
                login: user.value,
              },
            });
            const shop = this.shopregisterForm.getRawValue();
            this.shopService.createShop(shop).subscribe({
              next: () => {
                this.loginService.logout();
                this.success = true;
                console.log('kfjkd');
                this.router.navigate(['']);
              },
              error: response => this.processError(response),
            });
          }
        }
      });
    }
  }

  private processError(response: HttpErrorResponse): void {
    console.log('error');
    if (response.status === 400 && response.error.type === LOGIN_ALREADY_USED_TYPE) {
      this.errorUserExists = true;
    } else if (response.status === 400 && response.error.type === EMAIL_ALREADY_USED_TYPE) {
      this.errorEmailExists = true;
    } else {
      this.error = true;
    }
  }
}
