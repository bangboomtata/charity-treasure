import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IInterestedEvents } from '../interested-events.model';

@Component({
  selector: 'jhi-interested-events-detail',
  templateUrl: './interested-events-detail.component.html',
})
export class InterestedEventsDetailComponent implements OnInit {
  interestedEvents: IInterestedEvents | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ interestedEvents }) => {
      this.interestedEvents = interestedEvents;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
