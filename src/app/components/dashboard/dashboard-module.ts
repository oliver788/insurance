import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MatRadioModule } from '@angular/material/radio';
import { MatButtonModule } from '@angular/material/button';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import { DashboardRoutingModule } from './dashboard-routing-module';
import { Home } from './home/home';
import { MatIconModule } from '@angular/material/icon';
import { Homeinsurace } from './homeinsurace/homeinsurace';
import { Compulsoryinsurace } from './compulsoryinsurace/compulsoryinsurace';
import { Cascoinsurace } from './cascoinsurace/cascoinsurace';
import { Navbar } from './navbar/navbar';
@NgModule({
  declarations: [
    Home,
    Homeinsurace,
    Compulsoryinsurace,
    Cascoinsurace,
    Navbar
  ],
  imports: [
    MatIconModule,
    CommonModule,
    ReactiveFormsModule,
    MatRadioModule,
    MatButtonModule,
    DashboardRoutingModule,
    MatProgressSpinnerModule
  ],
  exports: [
    Navbar
  ]
})
export class DashboardModule { }
