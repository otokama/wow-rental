import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmpVehicleComponent } from './emp-vehicle.component';

describe('EmpVehicleComponent', () => {
  let component: EmpVehicleComponent;
  let fixture: ComponentFixture<EmpVehicleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EmpVehicleComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EmpVehicleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
