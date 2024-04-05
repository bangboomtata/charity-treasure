import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ICustomerEmails } from '../customer-emails.model';

@Component({
  selector: 'jhi-customer-emails-detail',
  templateUrl: './customer-emails-detail.component.html',
})
export class CustomerEmailsDetailComponent implements OnInit {
  customerEmails: ICustomerEmails | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ customerEmails }) => {
      this.customerEmails = customerEmails;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
