import { NgModule } from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {LoginComponent} from './login/login.component';
import {HomeComponent} from './home/home.component';

import {MaterialModule} from './material-module';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {RegisterComponent} from './register/register.component';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {JwtInterceptor} from './interceptors/jwt.interceptor';
import {ErrorInterceptor} from './interceptors/error.interceptor';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatNativeDateModule} from '@angular/material/core';
import {MatFormFieldModule} from '@angular/material/form-field';
import { ReserveGadgetComponent } from './home/reserve-gadget/reserve-gadget.component';
import { EmpLoginComponent } from './employee/emp-login/emp-login.component';
import { EmpHomeComponent } from './employee/emp-home/emp-home.component';
import { SelectLocationComponent } from './home/reserve-gadget/select-location/select-location.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { SearchResultComponent } from './search-result/search-result.component';
import { VehicleItemComponent } from './search-result/vehicle-item/vehicle-item.component';
import { ReserveComponent } from './reserve/reserve.component';
import {IgxAvatarModule} from 'igniteui-angular';
import {AvatarModule} from 'ngx-avatar';
import { AccountComponent } from './account/account.component';
import { TripComponent } from './account/trip/trip.component';
import { EmpVehicleComponent } from './employee/emp-vehicle/emp-vehicle.component';
import { EmpLocationComponent } from './employee/emp-location/emp-location.component';
import { EmpRegisterComponent } from './employee/emp-register/emp-register.component';
import { EmpCompanyComponent } from './employee/emp-company/emp-company.component';
import { EmpCouponComponent } from './employee/emp-coupon/emp-coupon.component';
import { EmpReservationComponent } from './employee/emp-reservation/emp-reservation.component';
import { EmpRegisterCustomerComponent } from './employee/emp-register-customer/emp-register-customer.component';
import { EditDialogComponent } from './employee/edit-dialog/edit-dialog.component';
import { DeleteDialogComponent } from './employee/delete-dialog/delete-dialog.component';
@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HomeComponent,
    RegisterComponent,
    ReserveGadgetComponent,
    EmpLoginComponent,
    EmpHomeComponent,
    SelectLocationComponent,
    SearchResultComponent,
    VehicleItemComponent,
    ReserveComponent,
    AccountComponent,
    TripComponent,
    EmpVehicleComponent,
    EmpLocationComponent,
    EmpRegisterComponent,
    EmpCompanyComponent,
    EmpCouponComponent,
    EmpReservationComponent,
    EmpRegisterCustomerComponent,
    EditDialogComponent,
    DeleteDialogComponent
  ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        BrowserAnimationsModule,
        MaterialModule,
        FormsModule,
        ReactiveFormsModule,
        HttpClientModule,
        MatDatepickerModule,
        MatNativeDateModule,
        MatFormFieldModule,
        NgbModule,
        IgxAvatarModule,
        AvatarModule
    ],
  providers: [ { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true }],
  bootstrap: [AppComponent]
})
export class AppModule { }
