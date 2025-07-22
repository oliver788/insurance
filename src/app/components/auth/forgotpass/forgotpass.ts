// forgotpass.ts
import { Component, inject } from '@angular/core';
import { Auth, sendPasswordResetEmail } from '@angular/fire/auth';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-forgotpass',
  templateUrl: './forgotpass.html',
  styleUrls: ['./forgotpass.css'],
    standalone: false
})
export class Forgotpass {
  auth = inject(Auth);
  form!: FormGroup;
  router = inject(Router);
  errorMessage: string = '';
  isSubmissionInProgress: boolean = false;
  isPasswordEmailSent: boolean = false;

  constructor() {
    this.initForm();
  }

  initForm() {
    this.form = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email])
    });
  }

  onSubmit() {
    if (this.form.invalid) {
      return;
    }
    this.isSubmissionInProgress = true;

    sendPasswordResetEmail(this.auth, this.form.value.email)
      .then(() => {
        this.isPasswordEmailSent = true;
      })
      .catch(error => {
        this.isSubmissionInProgress = false;
        this.errorMessage = error.message;
      });
  }
}