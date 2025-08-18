import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Auth, User, signOut } from '@angular/fire/auth';
import { Firestore, doc, getDoc, updateDoc, setDoc, collection, getDocs } from '@angular/fire/firestore';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import emailjs from 'emailjs-com';
import { getStorage, ref, uploadString, getDownloadURL } from '@angular/fire/storage';
import { NgZone } from '@angular/core';

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
  private cd = inject(ChangeDetectorRef);
  private auth = inject(Auth);
  private zone = inject(NgZone);

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
  isUploading: boolean = false;
  uploadProgress: number = 0;
  uploadedImageUrl: string = '';

  allResponses: any[] = [];
  isLoadingAdminResponses: boolean = false;

  selectedImageBase64: string = '';
  selectedImageUrl: string = '';

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
      BonusMalus: new FormControl('', Validators.required),
         kartortenetiAdatok: new FormControl('', Validators.required)
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
        console.log('User response loaded:', docSnap.data());
      } else {
        console.log('No previous response found for user:', this.user.uid);
      }

      this.handleLoadComplete(true);
    } catch (error) {
      console.error('Error loading response:', error);
      console.log('Hiba történt az adatok betöltésekor');
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
      console.log('All responses loaded for admin:', this.allResponses.length);
    } catch (error) {
      console.error('Error loading all responses:', error);
      console.log('Hiba történt az admin adatok betöltésekor');
    } finally {
      this.isLoadingAdminResponses = false;
      this.cd.detectChanges();
    }
  }

  private handleLoadComplete(success: boolean, error: boolean = false): void {
    this.isLoading = false;
    this.loadError = error;
  }

  async onSignout(): Promise<void> {
    try {
      await signOut(this.auth);
      this.router.navigate(['/auth/login']);
    } catch (error) {
      console.error('Sign out error:', error);
      console.log('Hiba történt a kijelentkezéskor');
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
       type: "kotelezto",
      timestamp: new Date(),
      ...this.surveyForm.value
    };

    try {
      if (this.hasExistingResponse) {
        await updateDoc(doc(this.firestore, 'answers', this.existingDocId), formData);
        console.log('Document updated:', this.existingDocId, formData);
        console.log('Sikeresen módosítva!');
        await this.sendEmail('update');
      } else {
        await setDoc(doc(this.firestore, 'answers', this.user.uid), formData);
        console.log('Document created:', this.user.uid, formData);
        this.hasExistingResponse = true;
        this.existingDocId = this.user.uid;
        console.log('Sikeresen elküldve!');
        await this.sendEmail('new');
      }

      this.isSubmitted = true;
      this.surveyForm.disable();
    } catch (error) {
      console.error('Submission error:', error);
      console.log('Hiba történt a beküldéskor');
    } finally {
      this.isSubmitting = false;
      this.cd.detectChanges();
    }
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (!file) {
      console.log('Nincs fájl kiválasztva');
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      const base64 = reader.result as string;

      if (!base64.startsWith('data:image/')) {
        console.log('A fájl nem kép típusú.');
        return;
      }

      setTimeout(() => {
        this.selectedImageBase64 = base64;
        this.selectedImageUrl = base64;
        this.cd.detectChanges();
      });

      this.uploadImage(base64);
    };

    reader.onerror = (err) => {
      console.error('Kép beolvasási hiba:', err);
      console.log('Nem sikerült beolvasni a képet');
    };

    reader.readAsDataURL(file);
  }

private async uploadImage(base64: string): Promise<void> {
  console.log('uploadImage called');
  const storage = getStorage();

  // A user.uid-val szeretnéd a képet menteni, itt biztosítsd, hogy a user létezik
  if (!this.user?.uid) {
    console.error('Nincs felhasználói azonosító, nem lehet feltölteni a képet.');
    return;
  }

  const imageRef = ref(storage, `casco_uploads/${this.user.uid}.jpg`);
  console.log('Storage ref:', imageRef.fullPath);

  this.isUploading = true;

  try {
    console.log('Starting uploadString...');
    console.log('Base64 length:', base64.length);

    // Ellenőrizd, hogy a base64 string "data:image/..." formátumban van-e
    if (!base64.startsWith('data:image/')) {
      console.error('Nem képfájl a base64 string:', base64.slice(0, 30));
      throw new Error('Nem képfájl a base64 adat');
    }

    // Itt a Firebase Storage uploadString metódusa a "data_url" formátumot várja,
    // nem "base64"-et, ha a string data URL formátumban van (pl. data:image/jpeg;base64,...)
    await uploadString(imageRef, base64, 'data_url');

    console.log('Upload successful!');

    // Letöltési URL lekérése
    const downloadURL = await getDownloadURL(imageRef);
    this.uploadedImageUrl = downloadURL;
    console.log('Download URL:', downloadURL);
    console.log('Kép sikeresen feltöltve!');
  } catch (err: any) {
    console.error('Hiba történt a kép feltöltésekor:', err);

    if (err?.code) {
      console.error('Firebase Storage error code:', err.code);
    }
    if (err?.message) {
      console.error('Firebase Storage error message:', err.message);
    }
    if (err?.customData) {
      console.error('Custom error data:', err.customData);
    }
    if (err?.serverResponse) {
      console.error('Server response:', err.serverResponse);
    }
    if (err?.stack) {
      console.error('Stack trace:', err.stack);
    }

    console.log('Hiba a kép feltöltésekor');
  } finally {
    this.isUploading = false;
    this.cd.detectChanges();
  }
}


 private async sendEmail(type: 'new' | 'update') {
  const form = this.surveyForm.value;

  const templateParams = {
    to_email: this.user.email,
    
    message: type === 'new'
      ? 'Köszönjük, hogy beküldte a Kötelező ajánlatkérőt!'
      : 'A Kötelező űrlap sikeresen frissítve lett.',
    user_email: this.user.email,
    image_data: this.uploadedImageUrl || '', // <<< ide tesszük a Firebase kép URL-jét
    ...form,

  };

  try {
    await emailjs.send(
      'service_3l4skcp',
      'template_fjfp4uv',
      templateParams,
      '1HoL76uozXpANfljR'
    );
    console.log('Email sent successfully!');
       console.log(this.uploadedImageUrl+"   !!!!!!!!")
  } catch (error) {
    console.error('Email sending failed:', error);
    console.log('Hiba történt az email küldésekor');
 
  }
}


  retryLoad(): void {
    this.isLoading = true;
    this.loadError = false;
    this.loadUserResponse();
  }
}
