import { NgModule, provideBrowserGlobalErrorListeners, provideZonelessChangeDetection } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing-module';
import { App } from './app';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { getStorage, provideStorage } from '@angular/fire/storage'; // Storage import hozzáadva
import { WelcomePage } from './components/welcome-page/welcome-page';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { Footer } from './components/footer/footer'; // SnackBar modul hozzáadva

@NgModule({
  declarations: [
    App,
    WelcomePage,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MatButtonModule,
    MatSnackBarModule // SnackBar modul importálva
  ],
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideFirebaseApp(() => initializeApp({ 
      projectId: "succses-f8106", 
      appId: "1:861930410588:web:59bcc112cecc0ceaf00c99", 
      storageBucket: "gs://succses-f8106.firebasestorage.app", // Javított storageBucket érték
      apiKey: "AIzaSyB5QZG970lgCK7w1TvqUCZK1WfZL19YZkI", 
      authDomain: "succses-f8106.firebaseapp.com", 
      messagingSenderId: "861930410588", 
      measurementId: "G-NQGTLWRR8G" 
    })),
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore()),
    provideStorage(() => getStorage()) // Storage provider hozzáadva
  ],
  bootstrap: [App]
})
export class AppModule { }