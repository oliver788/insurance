import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Auth, signOut, authState } from '@angular/fire/auth';
import { Observable } from 'rxjs';
@Component({
  selector: 'app-navbar',
  standalone: false,
  templateUrl: './navbar.html',
  styleUrls: ['./navbar.css'] // (ha eddig styleUrl volt, javítsd erre)
})
export class Navbar {
  private auth = inject(Auth);
  private router = inject(Router);

  // Bejelentkezett user figyelése, hogy feltételesen mutassuk a gombot
  user$: Observable<any> = authState(this.auth);

  // (Ha használod máshol)
  toggleMenu() {
    const navbarLinks = document.getElementById('navbar-links');
    const menuToggle = document.querySelector('.menu-toggle');
    navbarLinks?.classList.toggle('active');
    menuToggle?.classList.toggle('active');
  }

  async logout() {
      try {
      await signOut(this.auth);
      this.router.navigate(['/auth/login']);
    } catch (error) {
      console.error('Sign out error:', error);
    }
  }
}
