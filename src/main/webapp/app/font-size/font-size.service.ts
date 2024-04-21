import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Router, NavigationEnd } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class FontSizeService {
  constructor(private router: Router) {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        // Call adjustFontSize() whenever navigation starts, slight delay to wait for everything to load first
        setTimeout(() => this.adjustFontSize(), 400);
      }
    });
  }

  private fontSizeSubject = new BehaviorSubject<number>(100); // Default font size is 100%
  fontSize$ = this.fontSizeSubject.asObservable();

  setFontSize(fontSize: number): void {
    this.fontSizeSubject.next(fontSize);
  }

  getFontSize(): number {
    return this.fontSizeSubject.value;
  }

  increaseFont(event: Event): void {
    this.setFontSize(this.getFontSize() + 5);
    this.adjustFontSize();
  }

  decreaseFont(event: Event): void {
    this.setFontSize(this.getFontSize() - 5);
    this.adjustFontSize();
  }

  adjustFontSize() {
    console.log('CURRENT FONT SIZE: ' + this.getFontSize() + '%');
    document.body.style.fontSize = `${this.getFontSize()}%`;

    const h1Elements = document.querySelectorAll('h1');
    h1Elements.forEach(element => {
      element.style.fontSize = `${80 * (this.getFontSize() / 100)}px`;
    });

    const h2Elements = document.querySelectorAll('h2');
    h2Elements.forEach(element => {
      element.style.fontSize = `${40 * (this.getFontSize() / 100)}px`;
    });

    const h3Elements = document.querySelectorAll('h3');
    h3Elements.forEach(element => {
      element.style.fontSize = `${32 * (this.getFontSize() / 100)}px`;
    });

    const h4Elements = document.querySelectorAll('h4');
    h4Elements.forEach(element => {
      element.style.fontSize = `${25 * (this.getFontSize() / 100)}px`;
    });

    const h5Elements = document.querySelectorAll('h5');
    h5Elements.forEach(element => {
      element.style.fontSize = `${20 * (this.getFontSize() / 100)}px`;
    });

    const pElements = document.querySelectorAll('p');
    pElements.forEach(element => {
      element.style.fontSize = `${16 * (this.getFontSize() / 100)}px`;
    });

    const aElements = document.querySelectorAll('a');
    aElements.forEach(element => {
      element.style.fontSize = `${16 * (this.getFontSize() / 100)}px`;
    });

    const divElements = document.querySelectorAll('div');
    divElements.forEach(element => {
      element.style.fontSize = `${16 * (this.getFontSize() / 100)}px`;
    });

    const liElements = document.querySelectorAll('li');
    liElements.forEach(element => {
      element.style.fontSize = `${16 * (this.getFontSize() / 100)}px`;
    });

    const span = document.querySelectorAll('span');
    span.forEach(element => {
      element.style.fontSize = `${16 * (this.getFontSize() / 100)}px`;
    });

    const buttons = document.querySelectorAll('button');
    buttons.forEach(button => {
      button.style.fontSize = `${16 * (this.getFontSize() / 100)}px`;
    });

    const navbarTitle = document.querySelectorAll('.navbar-title') as NodeListOf<HTMLElement>;
    navbarTitle.forEach(title => {
      title.style.fontSize = `${20 * (this.getFontSize() / 100)}px`;
    });
    const navbarVersion = document.querySelectorAll('.navbar-version') as NodeListOf<HTMLElement>;
    navbarVersion.forEach(title => {
      title.style.fontSize = `${13 * (this.getFontSize() / 100)}px`;
    });
  }
}
