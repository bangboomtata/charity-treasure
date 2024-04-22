import { Component, ViewChild, OnInit, AfterViewInit, ElementRef } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { LoginService } from 'app/login/login.service';
import { AccountService } from 'app/core/auth/account.service';
import { UserDataService } from '../account/register/userData.service'; // Import UserDataService

@Component({
  selector: 'jhi-login',
  styleUrls: ['./login.component.scss'],
  templateUrl: './login.component.html',
})
export class LoginComponent implements OnInit, AfterViewInit {
  @ViewChild('username', { static: false })
  username!: ElementRef;

  authenticationError = false;

  loginForm = new FormGroup({
    username: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    password: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    rememberMe: new FormControl(false, { nonNullable: true, validators: [Validators.required] }),
  });

  constructor(
    private accountService: AccountService,
    private loginService: LoginService,
    private router: Router,
    private userDataService: UserDataService // Inject UserDataService
  ) {}

  selectedPhoto: string | null = null;

  selectPhoto(photoName: string): void {
    this.selectedPhoto = this.selectedPhoto === photoName ? null : photoName;
  }

  ngOnInit(): void {
    // if already authenticated then we should navigate to item view page
    this.accountService.identity().subscribe(() => {
      if (this.accountService.isAuthenticated()) {
        this.router.navigate(['']);
      }
    });
  }

  ngAfterViewInit(): void {
    this.username.nativeElement.focus();
  }

  guest() {
    this.router.navigate(['']);
  }

  login(): void {
    const username = this.loginForm.get('username')?.value;
    if (username) {
      this.loginService.login(this.loginForm.getRawValue()).subscribe({
        next: () => {
          this.authenticationError = false;
          this.userDataService.setUsername(username);
          if (!this.router.getCurrentNavigation()) {
            this.router.navigate(['']);
          }
        },
        error: () => (this.authenticationError = true),
      });
    }
  }
}
