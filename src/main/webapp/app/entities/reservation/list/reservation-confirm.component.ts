import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-reservation-confirmation',
  templateUrl: './reservation-confirm.component.html',
  styleUrls: ['./reservation-confirm.component.scss'],
})
export class ReservationConfirmationComponent implements OnInit {
  //headingMessage: String = 'WAITING FOR THE RESERVATION TO BE CONFIRMED';
  initialMessage: string = ' Please wait for confirmation from the shop.';
  secondaryMessage: string = "If the item has already been sold in the shop, it won't be available to be reserved.";
  thirdMessage: string = 'RESERVATION CONFIRMED!';
  feedbackAsk: string = 'Would you like to give us feedback?';
  showMessage: boolean = true;
  showFeedbackButtons = false; // This will control the feedback buttons

  constructor() {}

  ngOnInit(): void {
    setTimeout(() => {
      this.showMessage = false;
      this.showFeedbackButtons = true; // Show the feedback buttons after 10 seconds
    }, 10000); // 10000 ms = 10 seconds
  }
}
