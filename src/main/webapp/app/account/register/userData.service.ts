import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class UserDataService {
  private username: string | null = null;

  setUsername(username: string): void {
    this.username = username;
  }

  getUsername(): string | null {
    return this.username;
  }

  clearUsername(): void {
    this.username = null;
  }
}
