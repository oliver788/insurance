import { Component, inject } from '@angular/core';
import { Auth, AuthErrorCodes, GoogleAuthProvider, signInWithEmailAndPassword } from '@angular/fire/auth';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { createUserWithEmailAndPassword } from '@firebase/auth';
import { signInWithPopup } from '@angular/fire/auth';
import { ChangeDetectorRef } from '@angular/core';
import { ValidatorFn, AbstractControl } from '@angular/forms';
@Component({
  selector: 'app-signup',
  standalone: false,
  templateUrl: './signup.html',
  styleUrl: './signup.css'
})
export class Signup {
authForm!: FormGroup;

  googleAuthProvider = new GoogleAuthProvider();
  auth = inject(Auth);

  isSubmitionInProgress: boolean = false;
  errorMessage: string = '';

  constructor(private router: Router, private cd: ChangeDetectorRef) {
    this.initForm();
  }
  hidePassword: boolean = true;
initForm() {
  this.authForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', Validators.required),
    confirmPassword: new FormControl('', Validators.required)
  }, { validators: this.passwordsMatchValidator });
}

passwordsMatchValidator: ValidatorFn = (group: AbstractControl): { [key: string]: any } | null => {
  const password = group.get('password')?.value;
  const confirm = group.get('confirmPassword')?.value;
  return password === confirm ? null : { passwordMismatch: true };
};

 onSubmit() {
  if (this.authForm.invalid) {
    this.authForm.markAllAsTouched();
    return;
  }

  this.isSubmitionInProgress = true;
  this.errorMessage = ''; // töröljük az előző hibát

  createUserWithEmailAndPassword(this.auth, this.authForm.value.email, this.authForm.value.password)
    .then(() => {
      this.redirectToDashboard();
    })
    .catch(error => {
 this.isSubmitionInProgress = false;
  console.error('error:', error);

if (error instanceof Error) {
  if (error.message.includes(AuthErrorCodes.INVALID_EMAIL)) {
    this.errorMessage = 'Az email cím nem érvényes';
  }
  else if(error.message.includes('auth/invalid-credential')){
 this.errorMessage = 'Az email/jelszó cím nem érvényes';
  }
  else if (error.message.includes(AuthErrorCodes.WEAK_PASSWORD)) {
    this.errorMessage = 'Kérjük, adj meg egy erősebb jelszót';
  }
  else if (error.message.includes(AuthErrorCodes.EMAIL_EXISTS)) {
    this.errorMessage = 'Ez az email cím már egy másik fiókhoz van regisztrálva';
  }
  else {
    this.errorMessage = 'Valami hiba történt, kérjük, próbáld újra';
  }
} else {
  this.errorMessage = 'Váratlan hiba történt';
}
 this.cd.detectChanges();
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
