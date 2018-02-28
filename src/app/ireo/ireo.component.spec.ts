import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IreoComponent } from './ireo.component';

describe('IreoComponent', () => {
  let component: IreoComponent;
  let fixture: ComponentFixture<IreoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IreoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IreoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
