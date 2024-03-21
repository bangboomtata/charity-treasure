import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IFeedback } from '../feedback.model';
import { DataUtils } from 'app/core/util/data-util.service';

@Component({
  selector: 'jhi-feedback-detail',
  templateUrl: './feedback-detail.component.html',
})
export class FeedbackDetailComponent implements OnInit {
  feedback: IFeedback | null = null;

  constructor(protected dataUtils: DataUtils, protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ feedback }) => {
      this.feedback = feedback;
    });
  }

  byteSize(base64String: string): string {
    return this.dataUtils.byteSize(base64String);
  }

  openFile(base64String: string, contentType: string | null | undefined): void {
    this.dataUtils.openFile(base64String, contentType);
  }

  previousState(): void {
    window.history.back();
  }
}
