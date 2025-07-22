import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Login } from './login/login';
import { Signup } from './signup/signup';
import { Forgotpass } from './forgotpass/forgotpass';

const routes: Routes = [{
path: '',
component: Login
}, 
{
path: 'login',
component: Login
}, 
{
path: 'signup',
component: Signup
}, 
{
path: 'forgotpass',
component: Forgotpass
},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthRoutingModule { }
