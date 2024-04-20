import { Component, Input, OnInit } from '@angular/core';
import { HttpHeaders } from '@angular/common/http';
import { ActivatedRoute, Data, ParamMap, Router } from '@angular/router';
import { BehaviorSubject, combineLatest, filter, Observable, Subscription, switchMap, tap } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { HttpClient } from '@angular/common/http';

import { IChat } from '../chat.model';
import { IShop } from '../../shop/shop.model';
import { ICustomer } from '../../customer/customer.model';
import { AccountService } from 'app/core/auth/account.service';
import { ShopService } from 'app/entities/shop/service/shop.service';
import { SelectedShopService } from '../service/selected-shop.service';
import { CustomerService } from 'app/entities/customer/service/customer.service';

import { ITEMS_PER_PAGE } from 'app/config/pagination.constants';
import { ASC, DESC, SORT, ITEM_DELETED_EVENT, DEFAULT_SORT_DATA } from 'app/config/navigation.constants';
import { EntityArrayResponseType, ChatService } from '../service/chat.service';
import { ChatDeleteDialogComponent } from '../delete/chat-delete-dialog.component';
import { DataUtils } from 'app/core/util/data-util.service';
import { ParseLinks } from 'app/core/util/parse-links.service';
import { IUser } from '../../user/user.model';

@Component({
  selector: 'jhi-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css'],
})
export class ChatComponent implements OnInit {
  chats?: IChat[];
  customers?: ICustomer[];
  users?: IUser[];
  isLoading = false;
  newMessage: string = '';
  userIds: number[] = [];
  shops: IShop[] = [];
  shopUserLogins: (string | null | undefined)[] = [];
  receiverLogin: string = '';
  shopName: string = '';
  shopUserId: number = 0;
  customer$!: Observable<ICustomer | null>;
  customer?: ICustomer;
  customerLogin?: string;

  //Show
  showChatPerson: boolean = false;
  showChatHistory: boolean = false;
  showSendMessage: boolean = false;
  currentUserLogin: string = '';
  currentUserId: number = 0;
  userLogin: string | undefined;
  isCurrentUserInShopUserIds$ = new BehaviorSubject<boolean>(false);

  predicate = 'id';
  ascending = true;

  itemsPerPage = ITEMS_PER_PAGE;
  links: { [key: string]: number } = {
    last: 0,
  };
  page = 1;

  constructor(
    protected chatService: ChatService,
    protected activatedRoute: ActivatedRoute,
    public router: Router,
    protected parseLinks: ParseLinks,
    protected dataUtils: DataUtils,
    protected modalService: NgbModal,
    protected accountService: AccountService,
    protected shopService: ShopService,
    protected selectedShopService: SelectedShopService,
    protected route: ActivatedRoute,
    protected http: HttpClient,
    protected customerService: CustomerService
  ) {}

  ngOnInit(): void {
    this.load();

    this.checkCurrentUserInShopUserIds();

    this.customer$ = this.accountService.getCustomer();

    this.customer$.subscribe(customer => {
      console.log('Customer:', customer);
    });

    // Fetch all customers
    this.customerService.getAllCustomers().subscribe({
      next: (customers: ICustomer[]) => {
        this.customers = customers;
        // if (this.checkCurrentUserInShopUserIds() && this.customers.length > 0 && this.customers[0].user?.id) {
        //   this.getLoginAndSendMessage(this.customers[0].user?.id);
        // }
      },
      error: (error: any) => {
        console.error('Error fetching customers:', error);
        // Handle error as needed
      },
    });

    // Fetch all shops
    this.shopService.getAllShops().subscribe({
      next: (shops: IShop[]) => {
        this.shops = shops;

        // if (!this.checkCurrentUserInShopUserIds()) {
        //   const firstShop = this.shops[0];
        //   this.setReceiverLoginAndSendMessage(firstShop.shopName || '', firstShop.user?.id || 0);
        // }
      },
      error: (error: any) => {
        console.error('Error fetching shops:', error);
        // Handle error as needed
      },
    });

    // Subscribe to getAllUsers
    this.accountService.getAllUsers().subscribe(
      (users: IUser[]) => {
        this.users = users;
        console.log('All Users:', users);
      },
      error => {
        console.error('Error fetching users:', error);
        // Handle error as needed
      }
    );

    // Retrieve current user's login and set senderLogin
    this.accountService.identity().subscribe(account => {
      if (account) {
        this.currentUserLogin = account.login;
        console.log('Current User Login:', this.currentUserLogin);
      }
    });

    // Fetch all shop user IDs
    this.shopService.getAllShopUserIds().subscribe(userIds => {
      this.userIds = userIds;
      // Once user IDs are fetched, check if current user is in the shop user IDs
      this.checkCurrentUserInShopUserIds();
    });

    // Retrieve current user's ID
    this.accountService.identity().subscribe(account => {
      if (account) {
        this.accountService.getUserIdByLogin(account.login).subscribe(userId => {
          if (userId) {
            this.currentUserId = userId;
            console.log('Current User ID:', this.currentUserId);
            // Once current user ID is fetched, check if current user is in the shop user IDs
            this.checkCurrentUserInShopUserIds();
          }
        });
      }
    });

    this.shopService.getAllShops().subscribe({
      next: (shops: IShop[]) => {
        this.shops = shops;
        console.log('Shops:', shops);
      },
      error: (error: any) => {
        console.error('Error fetching shops:', error);
        // Handle error as needed
      },
    });

    const customerId = this.customer?.user?.id;

    if (customerId !== undefined) {
      // Call the service method to get the user login using the customer ID
      this.accountService.getLoginByUserId(customerId).subscribe(userLogin => {
        if (userLogin) {
          // Do something with the user login
          console.log('User Login:', userLogin);
        } else {
          console.log('User login not found for the given customer id.');
        }
      });
    } else {
      console.error('Customer ID is not available.');
    }
  }

  redirectToShop(shopName: string): void {
    this.router.navigate(['/shop'], { queryParams: { shopName: shopName } });
  }

  getLoginAndSendMessage(customerId: number) {
    if (customerId !== undefined) {
      this.accountService.getLoginByUserId(customerId).subscribe(
        login => {
          if (login) {
            this.setReceiverLoginAndSendMessage(login, customerId);
          } else {
            console.log('User login not found for the given user ID.');
          }
        },
        error => {
          console.error('Error fetching user login:', error);
          // Handle error as needed
        }
      );
    } else {
      console.log('Customer ID is undefined. Cannot fetch user login.');
    }
  }

  setReceiverLoginAndSendMessage(shopName: string, shopUserId: number): void {
    this.showChatPerson = true;
    this.showChatHistory = true;
    this.showSendMessage = true;
    this.shopName = shopName;
    this.receiverLogin = shopUserId.toString();
    this.shopUserId = shopUserId;
  }

  checkCurrentUserInShopUserIds(): boolean {
    const isUserInShopUserIds = this.userIds.includes(this.currentUserId);
    this.isCurrentUserInShopUserIds$.next(isUserInShopUserIds);
    return isUserInShopUserIds;
  }

  hasMessages(): boolean {
    if (this.chats) {
      return this.chats.some(chat => chat.senderLogin == this.currentUserId.toString() && chat.receiverLogin == this.shopUserId.toString());
    }
    return false;
  }

  selectedImageData: string | ArrayBuffer | null = null;

  // Event handler for when a file is selected
  onFileSelected(event: any): void {
    const file: File = event.target.files[0];
    if (file) {
      // Read the file as a data URL
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        // Store the image data in the selectedImageData variable
        this.selectedImageData = reader.result;
      };
    }
  }

  sendMessageAndNavigate(): void {
    const message = (document.getElementById('messageInput') as HTMLInputElement).value;

    // Check if message is not empty
    if (message.trim() !== '') {
      // Initialize queryParams with message
      const queryParams: any = {
        message: message,
        receiverLogin: this.receiverLogin,
      };

      // Check if an image is selected
      if (this.selectedImageData) {
        // Convert the image data to a base64 string and add it to queryParams
        const base64Image = this.selectedImageData.toString();
        queryParams.image = base64Image;
      }

      // Navigate to the chat-update component with queryParams
      this.router.navigate(['/chat/new'], { queryParams: queryParams });
    } else {
      // Handle case where message is empty
      console.error('Message cannot be empty.');
    }
  }

  convertImageToBase64(imageData: Uint8Array): Observable<string> {
    const blob = new Blob([imageData], { type: 'image/jpeg' });

    // Read the image blob as a base64 string
    return new Observable<string>(observer => {
      const reader = new FileReader();
      reader.onloadend = () => {
        observer.next(reader.result as string);
        observer.complete();
      };
      reader.readAsDataURL(blob);
    });
  }

  reset(): void {
    this.page = 1;
    this.chats = [];
    this.load();
  }

  loadPage(page: number): void {
    this.page = page;
    this.load();
  }

  trackId = (_index: number, item: IChat): number => this.chatService.getChatIdentifier(item);

  byteSize(base64String: string): string {
    return this.dataUtils.byteSize(base64String);
  }

  openFile(base64String: string, contentType: string | null | undefined): void {
    return this.dataUtils.openFile(base64String, contentType);
  }

  delete(chat: IChat): void {
    const modalRef = this.modalService.open(ChatDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.chat = chat;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed
      .pipe(
        filter(reason => reason === ITEM_DELETED_EVENT),
        switchMap(() => this.loadFromBackendWithRouteInformations())
      )
      .subscribe({
        next: (res: EntityArrayResponseType) => {
          this.onResponseSuccess(res);
        },
      });
  }

  load(): void {
    this.loadFromBackendWithRouteInformations().subscribe({
      next: (res: EntityArrayResponseType) => {
        this.onResponseSuccess(res);
      },
    });
  }

  navigateToWithComponentValues(): void {
    this.handleNavigation(this.page, this.predicate, this.ascending);
  }

  navigateToPage(page = this.page): void {
    this.handleNavigation(page, this.predicate, this.ascending);
  }

  protected loadFromBackendWithRouteInformations(): Observable<EntityArrayResponseType> {
    return combineLatest([this.activatedRoute.queryParamMap, this.activatedRoute.data]).pipe(
      tap(([params, data]) => this.fillComponentAttributeFromRoute(params, data)),
      switchMap(() => this.queryBackend(this.page, this.predicate, this.ascending))
    );
  }

  protected fillComponentAttributeFromRoute(params: ParamMap, data: Data): void {
    const sort = (params.get(SORT) ?? data[DEFAULT_SORT_DATA]).split(',');
    this.predicate = sort[0];
    this.ascending = sort[1] === ASC;
  }

  protected onResponseSuccess(response: EntityArrayResponseType): void {
    this.fillComponentAttributesFromResponseHeader(response.headers);
    const dataFromBody = this.fillComponentAttributesFromResponseBody(response.body);
    this.chats = dataFromBody;
  }

  protected fillComponentAttributesFromResponseBody(data: IChat[] | null): IChat[] {
    const chatsNew = this.chats ?? [];
    if (data) {
      for (const d of data) {
        if (chatsNew.map(op => op.id).indexOf(d.id) === -1) {
          chatsNew.push(d);
        }
      }
    }
    return chatsNew;
  }

  protected fillComponentAttributesFromResponseHeader(headers: HttpHeaders): void {
    const linkHeader = headers.get('link');
    if (linkHeader) {
      this.links = this.parseLinks.parse(linkHeader);
    } else {
      this.links = {
        last: 0,
      };
    }
  }

  protected queryBackend(page?: number, predicate?: string, ascending?: boolean): Observable<EntityArrayResponseType> {
    this.isLoading = true;
    const pageToLoad: number = page ?? 1;
    const queryObject = {
      page: pageToLoad - 1,
      size: this.itemsPerPage,
      sort: this.getSortQueryParam(predicate, ascending),
    };
    return this.chatService.query(queryObject).pipe(tap(() => (this.isLoading = false)));
  }

  protected handleNavigation(page = this.page, predicate?: string, ascending?: boolean): void {
    const queryParamsObj = {
      page,
      size: this.itemsPerPage,
      sort: this.getSortQueryParam(predicate, ascending),
    };

    this.router.navigate(['./'], {
      relativeTo: this.activatedRoute,
      queryParams: queryParamsObj,
    });
  }

  protected getSortQueryParam(predicate = this.predicate, ascending = this.ascending): string[] {
    const ascendingQueryParam = ascending ? ASC : DESC;
    if (predicate === '') {
      return [];
    } else {
      return [predicate + ',' + ascendingQueryParam];
    }
  }
}
