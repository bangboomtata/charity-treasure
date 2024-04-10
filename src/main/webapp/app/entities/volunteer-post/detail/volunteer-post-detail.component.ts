import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IVolunteerPost } from '../volunteer-post.model';
import { DataUtils } from 'app/core/util/data-util.service';

@Component({
  selector: 'jhi-volunteer-post-detail',
  templateUrl: './volunteer-post-detail.component.html',
  styleUrls: ['../list/volunteer.component.scss', './volunteer-detail.component.scss'],
})
export class VolunteerPostDetailComponent implements OnInit {
  volunteerPost: IVolunteerPost | null = null;

  constructor(protected dataUtils: DataUtils, protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ volunteerPost }) => {
      this.volunteerPost = volunteerPost;
    });
  }

  byteSize(base64String?: string | null): string {
    return this.dataUtils.byteSize(base64String ?? '');
  }

  openFile(base64String: string, contentType: string | null | undefined): void {
    this.dataUtils.openFile(base64String, contentType);
  }

  previousState(): void {
    window.history.back();
  }
}
