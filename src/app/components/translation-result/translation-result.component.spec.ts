import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TranslationResultComponent } from './translation-result.component';

describe('TranslationResultComponent', () => {
  let component: TranslationResultComponent;
  let fixture: ComponentFixture<TranslationResultComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TranslationResultComponent]
    });
    fixture = TestBed.createComponent(TranslationResultComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
