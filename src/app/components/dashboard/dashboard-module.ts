import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

// Angular Material modulok
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';

// Routing modul
import { DashboardRoutingModule } from './dashboard-routing-module';

// Komponensek
import { Home } from './home/home';
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
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,        // 💡 Hozzáadva
    MatInputModule,            // 💡 Hozzáadva
    MatRadioModule,
    MatButtonModule,
    MatSelectModule,
    MatIconModule,
    MatProgressSpinnerModule,
    DashboardRoutingModule
  ],
  exports: [
    Navbar
  ]
})
export class DashboardModule { }
