import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Auth, User, signOut } from '@angular/fire/auth';
import { Firestore, doc, getDoc, updateDoc, setDoc, collection, getDocs } from '@angular/fire/firestore';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ChangeDetectorRef } from '@angular/core';
import emailjs from 'emailjs-com';

@Component({
  selector: 'app-compulsoryinsurace',
  standalone: false,
  templateUrl: './compulsoryinsurace.html',
  styleUrl: './compulsoryinsurace.css'
})
export class Compulsoryinsurace implements OnInit {
  private activatedRoute = inject(ActivatedRoute);
  private router = inject(Router);
  private firestore = inject(Firestore);
  private snackBar = inject(MatSnackBar);
  private cd = inject(ChangeDetectorRef);
  private auth = inject(Auth);

  user: User = this.activatedRoute.snapshot.data['user'];

  isAdmin: boolean = false;
  readonly ADMIN_EMAIL = 'admin@email.com';

  surveyForm!: FormGroup;
  submissionMessage: string = '';
  isSubmitted: boolean = false;
  hasExistingResponse: boolean = false;
  existingDocId: string = '';
  isLoading: boolean = true;
  loadError: boolean = false;
  isSubmitting: boolean = false;

  allResponses: any[] = [];
  isLoadingAdminResponses: boolean = false;

  selectedImageBase64: string = '';
  selectedImageUrl: string = '';
  uploadedImageUrl: string = '';
  isUploading: boolean = false;
  uploadProgress: number = 0;

  constructor() {
    this.isAdmin = this.user?.email === this.ADMIN_EMAIL;
    this.initializeForm();
  }

  ngOnInit(): void {
    this.loadUserResponse();
    if (this.isAdmin) this.loadAllResponses();
  }

  private initializeForm(): void {
    this.surveyForm = new FormGroup({
      szerzodoNev: new FormControl('', Validators.required),
      telefon: new FormControl('', Validators.required),
      szerzodoCim: new FormControl('', Validators.required),
      szuletesiDatum: new FormControl('', Validators.required),
      anyjaNeve: new FormControl('', Validators.required),
      cegAdoszam: new FormControl(''),
      szerzodesOka: new FormControl('', Validators.required),
      rendszam: new FormControl('', Validators.required),
      alvazszam: new FormControl('', Validators.required),
      forgalmiSzam: new FormControl('', Validators.required),
      jarmuKategoria: new FormControl('', Validators.required),
      gyarto: new FormControl('', Validators.required),
      tipus: new FormControl('', Validators.required),
      gyartasiEv: new FormControl('', Validators.required),
      hengerurtartalom: new FormControl('', Validators.required),
      teljesitmeny: new FormControl('', Validators.required),
      uzemanyag: new FormControl('', Validators.required),
      kmAllas: new FormControl('', Validators.required),
      kartortenet: new FormControl('', Validators.required),
      bonuszFokozat: new FormControl('', Validators.required)
    });
  }

  private async loadUserResponse(): Promise<void> {
    if (!this.user) {
      this.handleLoadComplete(false);
      return;
    }

    try {
      const userDocRef = doc(this.firestore, 'answers', this.user.uid);
      const docSnap = await getDoc(userDocRef);

      if (docSnap.exists()) {
        this.hasExistingResponse = true;
        this.existingDocId = this.user.uid;
        this.surveyForm.patchValue(docSnap.data());
        this.isSubmitted = true;
        this.surveyForm.disable();
      }
      this.handleLoadComplete(true);
    } catch (error) {
      console.error('Error loading response:', error);
      this.showSnackbar('Hiba történt az adatok betöltésekor');
      this.handleLoadComplete(false, true);
    } finally {
      this.cd.detectChanges();
    }
  }

  private async loadAllResponses(): Promise<void> {
    this.isLoadingAdminResponses = true;
    try {
      const answersRef = collection(this.firestore, 'answers');
      const querySnapshot = await getDocs(answersRef);
      this.allResponses = querySnapshot.docs.map(doc => doc.data());
    } catch (error) {
      console.error('Error loading all responses:', error);
      this.showSnackbar('Hiba történt az admin adatok betöltésekor');
    } finally {
      this.isLoadingAdminResponses = false;
      this.cd.detectChanges();
    }
  }

  private handleLoadComplete(success: boolean, error: boolean = false): void {
    this.isLoading = false;
    this.loadError = error;
    if (!success && !error) {
      this.loadError = false;
    }
  }

  async onSignout(): Promise<void> {
    try {
      await signOut(this.auth);
      this.router.navigate(['/auth/login']);
    } catch (error) {
      console.error('Sign out error:', error);
      this.showSnackbar('Hiba történt a kijelentkezéskor');
    }
  }

  enableEditing(): void {
    this.isSubmitted = false;
    this.submissionMessage = '';
    this.surveyForm.enable();
  }

  async submitForm(): Promise<void> {
    if (this.surveyForm.invalid || !this.user) return;

    this.isSubmitting = true;

    const formData = {
      userEmail: this.user.email,
      userId: this.user.uid,
      timestamp: new Date(),
      ...this.surveyForm.value
    };

    try {
      if (this.hasExistingResponse) {
        await updateDoc(doc(this.firestore, 'answers', this.existingDocId), formData);
        this.showSnackbar('Sikeresen módosítva!');
        await this.sendEmail('update');
      } else {
        await setDoc(doc(this.firestore, 'answers', this.user.uid), formData);
        this.hasExistingResponse = true;
        this.existingDocId = this.user.uid;
        this.showSnackbar('Sikeresen elküldve!');
        await this.sendEmail('new');
      }

      this.isSubmitted = true;
      this.surveyForm.disable();
    } catch (error) {
      console.error('Submission error:', error);
      this.showSnackbar('Hiba történt a beküldéskor');
    } finally {
      this.isSubmitting = false;
      this.cd.detectChanges();
    }
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        this.selectedImageBase64 = reader.result as string;
        this.selectedImageUrl = reader.result as string;
      };
      reader.onerror = (err) => {
        console.error('Kép beolvasási hiba:', err);
        this.showSnackbar('Hiba történt a kép beolvasásakor');
      };
      reader.readAsDataURL(file);
    }
  }

  private async sendEmail(type: 'new' | 'update') {
    const form = this.surveyForm.value;

    const templateParams = {
      to_email: this.user.email,
      message: type === 'new'
        ? 'Köszönjük, hogy beküldte a kötelező biztosítási ajánlatkérőt!'
        : 'A kötelező biztosítási űrlap sikeresen frissítve lett.',
      user_email: this.user.email,
      szerzodoNev: form.szerzodoNev,
      telefon: form.telefon,
      szerzodoCim: form.szerzodoCim,
      szuletesiDatum: form.szuletesiDatum,
      anyjaNeve: form.anyjaNeve,
      cegAdoszam: form.cegAdoszam,
      szerzodesOka: form.szerzodesOka,
      rendszam: form.rendszam,
      alvazszam: form.alvazszam,
      forgalmiSzam: form.forgalmiSzam,
      jarmuKategoria: form.jarmuKategoria,
      gyarto: form.gyarto,
      tipus: form.tipus,
      gyartasiEv: form.gyartasiEv,
      hengerurtartalom: form.hengerurtartalom,
      teljesitmeny: form.teljesitmeny,
      uzemanyag: form.uzemanyag,
      kmAllas: form.kmAllas,
      kartortenet: form.kartortenet,
      bonuszFokozat: form.bonuszFokozat,
      image_data: this.selectedImageBase64 || ''
    };

    try {
      await emailjs.send(
        'service_3l4skcp',
        'template_fjfp4uv',
        templateParams,
        '1HoL76uozXpANfljR'
      );
      console.log('Email sent successfully!');
    } catch (error) {
      console.error('Email sending failed:', error);
      this.showSnackbar('Hiba történt az email küldésekor');
    }
  }

  private showSnackbar(message: string): void {
    this.submissionMessage = message;
    this.snackBar.open(message, 'OK', { duration: 3000 });
  }

  retryLoad(): void {
    this.isLoading = true;
    this.loadError = false;
    this.loadUserResponse();
  }
}
