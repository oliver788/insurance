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
import { MatProgressBarModule } from '@angular/material/progress-bar';

// Firebase Storage modul (compat verzió)
import { AngularFireStorageModule } from '@angular/fire/compat/storage';

// Routing modul
import { DashboardRoutingModule } from './dashboard-routing-module';

// Komponensek
import { Home } from './home/home';
import { Homeinsurace } from './homeinsurace/homeinsurace';
import { Compulsoryinsurace } from './compulsoryinsurace/compulsoryinsurace';
import { Cascoinsurace } from './cascoinsurace/cascoinsurace';
import { Navbar } from './navbar/navbar';
import { Footer } from '../footer/footer';

@NgModule({
  declarations: [
    Home,
    Homeinsurace,
    Compulsoryinsurace,
    Cascoinsurace,
    Navbar, 
    Footer
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatRadioModule,
    MatButtonModule,
    MatSelectModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatProgressBarModule,
    DashboardRoutingModule,

    // Importáld a Firebase Storage modult az NgModule-ba
    AngularFireStorageModule,
  ],
  exports: [
    Navbar,
    Footer
  ]
})
export class DashboardModule { }
