import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Observable, ReplaySubject, of } from 'rxjs';
import { shareReplay, tap, catchError, map, switchMap } from 'rxjs/operators';

import { StateStorageService } from 'app/core/auth/state-storage.service';
import { ApplicationConfigService } from '../config/application-config.service';
import { Account } from 'app/core/auth/account.model';
import { IUser } from 'app/entities/user/user.model';
import { IShop } from 'app/entities/shop/shop.model';
import { ICustomer } from 'app/entities/customer/customer.model';

@Injectable({ providedIn: 'root' })
export class AccountService {
  private userIdentity: Account | null = null;
  private authenticationState = new ReplaySubject<Account | null>(1);
  private accountCache$?: Observable<Account> | null;

  constructor(
    private http: HttpClient,
    private stateStorageService: StateStorageService,
    private router: Router,
    private applicationConfigService: ApplicationConfigService
  ) {}

  getLoginByUserId(userId: number): Observable<string | null | undefined> {
    return this.getAllUsers().pipe(
      map(users => {
        const user = users.find(u => u.id === userId);
        return user ? user.login : null;
      })
    );
  }

  //get id of user based on account
  getUserIdByLogin(login: string): Observable<number | null> {
    return this.getAllUsers().pipe(
      map(users => {
        const matchingUser = users.find(user => user.login === login);
        return matchingUser ? matchingUser.id : null;
      })
    );
  }

  getShopByUserId(userId: number): Observable<IShop | null> {
    console.log('FIND SHOP BY USER ID: ' + userId);
    return this.getAllShops().pipe(
      map(shops => {
        const matchingShop = shops.find(shop => shop.user?.id === userId);
        return matchingShop ? matchingShop : null;
      })
    );
  }

  getCustomerByUserId(userId: number): Observable<ICustomer | null> {
    console.log('FIND Customer BY USER ID: ' + userId);
    return this.getAllCustomers().pipe(
      map(customers => {
        const matchingCustomer = customers.find(customer => customer.user?.id === userId);
        return matchingCustomer ? matchingCustomer : null;
      })
    );
  }

  //retrieve list of users from database
  private getAllUsers(): Observable<IUser[]> {
    return this.http.get<IUser[]>('/api/users');
  }
  private getAllShops(): Observable<IShop[]> {
    return this.http.get<IShop[]>('/api/shops');
  }
  private getAllCustomers(): Observable<ICustomer[]> {
    return this.http.get<ICustomer[]>('/api/customers');
  }

  //get the customer based on current account id
  getCustomer(): Observable<ICustomer | null> {
    if (!this.userIdentity) {
      return of(null);
    }
    return this.getUserIdByLogin(this.userIdentity.login).pipe(
      switchMap(userId => {
        if (userId) {
          console.log('USER ID FOUND: ' + userId);
          return this.getCustomerByUserId(userId);
        } else {
          console.log('USER ID NOT FOUND');
          return of(null);
        }
      })
    );
  }

  //get the customer based on current account id
  getShop(): Observable<IShop | null> {
    if (!this.userIdentity) {
      return of(null);
    }
    return this.getUserIdByLogin(this.userIdentity.login).pipe(
      switchMap(userId => {
        if (userId) {
          console.log('USER ID FOUND: ' + userId);
          return this.getShopByUserId(userId);
        } else {
          console.log('USER ID NOT FOUND');
          return of(null);
        }
      })
    );
  }

  save(account: Account): Observable<{}> {
    return this.http.post(this.applicationConfigService.getEndpointFor('api/account'), account);
  }

  authenticate(identity: Account | null): void {
    this.userIdentity = identity;
    this.authenticationState.next(this.userIdentity);
    if (!identity) {
      this.accountCache$ = null;
    }
  }

  hasAnyAuthority(authorities: string[] | string): boolean {
    if (!this.userIdentity) {
      return false;
    }
    if (!Array.isArray(authorities)) {
      authorities = [authorities];
    }
    return this.userIdentity.authorities.some((authority: string) => authorities.includes(authority));
  }

  identity(force?: boolean): Observable<Account | null> {
    if (!this.accountCache$ || force) {
      this.accountCache$ = this.fetch().pipe(
        tap((account: Account) => {
          this.authenticate(account);

          this.navigateToStoredUrl();
        }),
        shareReplay()
      );
    }
    return this.accountCache$.pipe(catchError(() => of(null)));
  }

  isAuthenticated(): boolean {
    return this.userIdentity !== null;
  }

  getAuthenticationState(): Observable<Account | null> {
    return this.authenticationState.asObservable();
  }

  private fetch(): Observable<Account> {
    return this.http.get<Account>(this.applicationConfigService.getEndpointFor('api/account'));
  }

  private navigateToStoredUrl(): void {
    // previousState can be set in the authExpiredInterceptor and in the userRouteAccessService
    // if login is successful, go to stored previousState and clear previousState
    const previousUrl = this.stateStorageService.getUrl();
    if (previousUrl) {
      this.stateStorageService.clearUrl();
      this.router.navigateByUrl(previousUrl);
    }
  }
}
