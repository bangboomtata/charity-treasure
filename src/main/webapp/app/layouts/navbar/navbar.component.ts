import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { VERSION } from 'app/app.constants';
import { Account } from 'app/core/auth/account.model';
import { AccountService } from 'app/core/auth/account.service';
import { LoginService } from 'app/login/login.service';
import { ProfileService } from 'app/layouts/profiles/profile.service';
import { EntityNavbarItems } from 'app/entities/entity-navbar-items';
import { FontSizeService } from '../../font-size/font-size.service';
import { IShop } from 'app/entities/shop/shop.model';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'jhi-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent implements OnInit {
  inProduction?: boolean;
  isNavbarCollapsed = true;
  openAPIEnabled?: boolean;
  version = '';
  account: Account | null = null;
  entitiesNavbarItems: any[] = [];
  fontSize = 100;
  isShop = false;
  Shop: IShop | null = null;
  isAuthenticated: boolean = false; // Add this property
  private destroy$ = new Subject<void>();

  constructor(
    private loginService: LoginService,
    private accountService: AccountService,
    private profileService: ProfileService,
    private router: Router,
    public fontSizeService: FontSizeService
  ) {
    if (VERSION) {
      this.version = VERSION.toLowerCase().startsWith('v') ? VERSION : `v${VERSION}`;
    }
  }

  ngOnInit(): void {
    this.entitiesNavbarItems = EntityNavbarItems;
    this.profileService.getProfileInfo().subscribe(profileInfo => {
      this.inProduction = profileInfo.inProduction;
      this.openAPIEnabled = profileInfo.openAPIEnabled;
    });

    this.accountService.getAuthenticationState().subscribe(account => {
      this.account = account;
      this.accountService.getShop().subscribe(shop => {
        if (shop !== null) {
          this.isShop = true;
          this.Shop = shop;
        }
      });
    });

    this.accountService
      .getAuthenticationState()
      .pipe(takeUntil(this.destroy$))
      .subscribe(account => {
        this.isAuthenticated = this.accountService.isAuthenticated();
      });

    // const increaseButton = document.getElementById('increase-btn');
    // const decreaseButton = document.getElementById('decrease-btn');

    // if (increaseButton && decreaseButton) {
    //   increaseButton.addEventListener('click', (event) => {
    //     event.preventDefault(); // Prevent default behavior of the button
    //     this.adjustFontSize(10); // Increase font size
    //   });

    //   decreaseButton.addEventListener('click', (event) => {
    //     event.preventDefault(); // Prevent default behavior of the button
    //     this.adjustFontSize(-10); // Decrease font size
    //   });
    // }
  }

  darkMode() {
    var element = document.body;
    element.classList.toggle('main-dark-mode');
  }

  collapseNavbar(): void {
    this.isNavbarCollapsed = true;
  }

  login(): void {
    this.router.navigate(['/login']);
    this.isShop = false;
  }

  logout(): void {
    this.collapseNavbar();
    this.loginService.logout();
    this.router.navigate(['']);
    this.isShop = false;
  }

  toggleNavbar(): void {
    this.isNavbarCollapsed = !this.isNavbarCollapsed;
  }
}
