import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthRoutingModule } from './auth-routing-module';
import { Login } from './login/login';
import { Signup } from './signup/signup';
import { Forgotpass } from './forgotpass/forgotpass';
import {MatButtonModule} from '@angular/material/button';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatIconModule} from '@angular/material/icon';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';

@NgModule({
  declarations: [
    
    Signup,
    Login,
    Forgotpass
  ],
  imports: [
    CommonModule,
    AuthRoutingModule,
    MatButtonModule,
    MatFormFieldModule,
    RouterModule,
    MatInputModule,
    MatIconModule,
    FormsModule,
ReactiveFormsModule,
MatProgressSpinnerModule,



  ]
})
export class AuthModule { }
