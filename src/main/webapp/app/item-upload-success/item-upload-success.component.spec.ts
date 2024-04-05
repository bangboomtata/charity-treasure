import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemUploadSuccessComponent } from './item-upload-success.component';

describe('ItemUploadSuccessComponent', () => {
  let component: ItemUploadSuccessComponent;
  let fixture: ComponentFixture<ItemUploadSuccessComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ItemUploadSuccessComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ItemUploadSuccessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
