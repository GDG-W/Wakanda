import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CheckInSuccessComponent } from './check-in-success.component';

describe('CheckInSuccessComponent', () => {
  let component: CheckInSuccessComponent;
  let fixture: ComponentFixture<CheckInSuccessComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CheckInSuccessComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CheckInSuccessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
