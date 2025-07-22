// login.ts (Javított verzió)
import { Component, inject } from '@angular/core';
import { Auth, AuthErrorCodes, GoogleAuthProvider, signInWithEmailAndPassword } from '@angular/fire/auth';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { signInWithPopup } from '@firebase/auth';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-login',
  templateUrl: './login.html',
  styleUrls: ['./login.css'],  // `styleUrls` (tömb), nem `styleUrl`
  standalone: false
})
export class Login {
  authForm!: FormGroup;
  googleAuthProvider = new GoogleAuthProvider();
  auth = inject(Auth);
  isSubmitionInProgress: boolean = false;
  errorMessage: string = '';

  // 👇👇 IDE jön:
  hidePassword: boolean = true;

  togglePasswordVisibility(): void {
    this.hidePassword = !this.hidePassword;
  }

  constructor(private router: Router, private cd: ChangeDetectorRef) {
    this.initForm();
  }

  initForm() {
    this.authForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', Validators.required)
    });
  }

  onSubmit() {
    if (this.authForm.invalid) {
      this.authForm.markAllAsTouched();
      return;
    }
    this.isSubmitionInProgress = true;
    this.errorMessage = '';

    signInWithEmailAndPassword(this.auth, this.authForm.value.email, this.authForm.value.password)
      .then(() => this.redirectToDashboard())
      .catch(error => {
        this.isSubmitionInProgress = false;
        console.error('error:', error);
        // Hibakezelés itt marad
      });
  }

  onSignInWithGoogle() {
    signInWithPopup(this.auth, this.googleAuthProvider)
      .then(() => this.redirectToDashboard())
      .catch(error => {
        console.error('Google belépés hiba:', error);
        this.errorMessage = 'Google bejelentkezés sikertelen.';
      });
  }

  redirectToDashboard() {
    this.router.navigate(['/dashboard']);
  }
}
