import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { AccountService } from 'app/core/auth/account.service';
import { Account } from 'app/core/auth/account.model';

@Component({
  selector: 'jhi-home',
  templateUrl: './home.component.html',
  styleUrls: ['home.component.scss'],
})
export class HomeComponent implements OnInit, OnDestroy {
  account: Account | null = null;

  darkModeEnabled = false;
  largeFont = false;
  fontSize = 100;

  private readonly destroy$ = new Subject<void>();

  constructor(private accountService: AccountService, private router: Router) {}

  ngOnInit(): void {
    this.accountService
      .getAuthenticationState()
      .pipe(takeUntil(this.destroy$))
      .subscribe(account => (this.account = account));
  }

  // dark mode
  /*
  toggleDarkMode(): void {
    const homeContainer = document.getElementById('home-container');
    if (homeContainer) {
      this.darkModeEnabled = !this.darkModeEnabled;
      if (this.darkModeEnabled) {
        homeContainer.classList.add('main-dark-mode');
      } else {
        homeContainer.classList.remove('main-dark-mode');
      }
    }
  }
   */

  darkMode() {
    var element = document.body;
    element.classList.toggle('main-dark-mode');
  }

  // toggle font size

  // toggleFontSize() {
  //   this.largeFont = !this.largeFont;
  //   document.body.classList.toggle('large-text', this.largeFont);
  // }

  // increaseFontSize() {
  //   this.fontSize += 10;
  //   document.body.style.fontSize = this.fontSize + '%';
  // }

  adjustFontSize() {
    document.body.style.fontSize = `${this.fontSize}%`;

    const h1Elements = document.querySelectorAll('h1');
    h1Elements.forEach(element => {
      element.style.fontSize = `${80 * (this.fontSize / 100)}px`;
    });

    const h3Elements = document.querySelectorAll('h3');
    h3Elements.forEach(element => {
      element.style.fontSize = `${32 * (this.fontSize / 100)}px`;
    });

    const h5Elements = document.querySelectorAll('h5');
    h5Elements.forEach(element => {
      element.style.fontSize = `${20 * (this.fontSize / 100)}px`;
    });

    const span = document.querySelectorAll('span');
    span.forEach(element => {
      element.style.fontSize = `${16 * (this.fontSize / 100)}px`;
    });

    const buttons = document.querySelectorAll('button');
    buttons.forEach(button => {
      button.style.fontSize = `${16 * (this.fontSize / 100)}px`;
    });
  }

  login(): void {
    this.router.navigate(['/login']);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
