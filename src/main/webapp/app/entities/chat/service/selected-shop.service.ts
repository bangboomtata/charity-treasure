import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SelectedShopService {
  private selectedShopNameSubject: BehaviorSubject<string> = new BehaviorSubject<string>('');

  constructor() {}

  setSelectedShopName(shopName: string): void {
    this.selectedShopNameSubject.next(shopName);
  }

  getSelectedShopName(): Observable<string> {
    return this.selectedShopNameSubject.asObservable();
  }
}
