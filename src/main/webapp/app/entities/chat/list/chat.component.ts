import { Component, OnInit } from '@angular/core';
import { HttpHeaders } from '@angular/common/http';
import { ActivatedRoute, Data, ParamMap, Router } from '@angular/router';
import { combineLatest, filter, Observable, Subscription, switchMap, tap } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IChat } from '../chat.model';
import { IShop } from 'app/entities/shop/shop.model';
import { AccountService } from 'app/core/auth/account.service';
import { ShopService } from 'app/entities/shop/service/shop.service';
import { SelectedShopService } from '../service/selected-shop.service';

import { ITEMS_PER_PAGE } from 'app/config/pagination.constants';
import { ASC, DESC, SORT, ITEM_DELETED_EVENT, DEFAULT_SORT_DATA } from 'app/config/navigation.constants';
import { EntityArrayResponseType, ChatService } from '../service/chat.service';
import { ChatDeleteDialogComponent } from '../delete/chat-delete-dialog.component';
import { DataUtils } from 'app/core/util/data-util.service';
import { ParseLinks } from 'app/core/util/parse-links.service';

@Component({
  selector: 'jhi-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css'],
})
export class ChatComponent implements OnInit {
  chats?: IChat[];
  isLoading = false;
  newMessage: string = '';
  userIds: number[] = [];
  shops: IShop[] = [];
  shopUserLogins: (string | null | undefined)[] = [];
  receiverLogin: string = '';
  shopName: string = '';
  shopUserId: number = 0;

  //Show
  showChatPerson: boolean = false;
  showChatHistory: boolean = false;
  showSendMessage: boolean = false;
  currentUserLogin: string = '';
  currentUserId: number = 0;

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
    protected route: ActivatedRoute
  ) {}

  hasMessages(): boolean {
    if (this.chats) {
      return this.chats.some(chat => chat.senderLogin == this.currentUserId.toString() && chat.receiverLogin == this.shopUserId.toString());
    }
    return false;
  }

  // Define a variable to store the image data
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
    // Assuming this.selectedImageData holds your image data
    if (this.selectedImageData) {
      // Convert the image data to a base64 string
      const base64Image = this.selectedImageData.toString();
      // Navigate to the chat-update component with message and image as query parameters
      this.router.navigate(['/chat/new'], {
        queryParams: {
          message: message,
          receiverLogin: this.receiverLogin,
          image: base64Image, // Pass the image data as a query parameter
        },
      });
    } else {
      // Handle case where no image is selected
      console.error('No image selected.');
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

  setReceiverLoginAndSendMessage(shopName: string, shopUserId: number): void {
    this.showChatPerson = true;
    this.showChatHistory = true;
    this.showSendMessage = true;
    this.shopName = shopName;
    this.receiverLogin = shopUserId.toString();
    this.shopUserId = shopUserId;
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

  ngOnInit(): void {
    this.load();

    // Fetch all shops
    this.shopService.getAllShops().subscribe({
      next: (shops: IShop[]) => {
        this.shops = shops;
      },
      error: (error: any) => {
        console.error('Error fetching shops:', error);
        // Handle error as needed
      },
    });

    // Retrieve current user's login and set senderLogin
    this.accountService.identity().subscribe(account => {
      if (account) {
        this.currentUserLogin = account.login;
        console.log('Current User Login:', this.currentUserLogin);
      }
    });

    // Retrieve current user's ID
    this.accountService.identity().subscribe(account => {
      if (account) {
        this.accountService.getUserIdByLogin(account.login).subscribe(userId => {
          if (userId) {
            this.currentUserId = userId;
            console.log('Current User ID:', this.currentUserId);
          }
        });
      }
    });

    this.shopService.getAllShopUserIds().subscribe(userIds => {
      this.userIds = userIds;
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

    this.shopService.getLoginsForShopUsers().subscribe({
      next: logins => {
        this.shopUserLogins = logins;
        console.log('Shop user logins:', logins);
      },
      error: error => {
        console.error('Error fetching shop user logins:', error);
      },
    });
  }

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
