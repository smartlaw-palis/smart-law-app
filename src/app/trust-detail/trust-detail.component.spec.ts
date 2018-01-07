import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TrustDetailComponent } from './trust-detail.component';

describe('TrustDetailComponent', () => {
  let component: TrustDetailComponent;
  let fixture: ComponentFixture<TrustDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TrustDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TrustDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
