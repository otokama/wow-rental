import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {HomeComponent} from './home/home.component';
import {LoginComponent} from './login/login.component';
import {AuthGuard} from './_services/auth-guard.service';
import {RegisterComponent} from './register/register.component';
import {Role} from './_models/role';
import {EmpLoginComponent} from './employee/emp-login/emp-login.component';
import {EmpHomeComponent} from './employee/emp-home/emp-home.component';
import {SearchResultComponent} from './search-result/search-result.component';
import {ReserveComponent} from './reserve/reserve.component';
import {AccountComponent} from './account/account.component';
import {TripComponent} from './account/trip/trip.component';



const routes: Routes = [
  { path: '', component: HomeComponent},
  { path: 'login', component: LoginComponent},
  { path: 'account', component: AccountComponent, canActivate: [AuthGuard]},
  { path: 'trip', component: TripComponent, canActivate: [AuthGuard], data: {roles: [Role.customer]}},
  { path: 'register', component: RegisterComponent },
  { path: 'search', component: SearchResultComponent },
  { path: 'reserve', component: ReserveComponent, canActivate: [AuthGuard], data: {roles: [Role.customer]}},
  { path: 'employee/login', component: EmpLoginComponent},
  // { path: 'employee/home', component: EmpHomeComponent, canActivate: [AuthGuard], data: { roles: [Role.employee] }},
  { path: '**', redirectTo: '' }];

@NgModule({
  imports: [RouterModule.forRoot(routes) ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
