import { Component } from '@angular/core';

@Component({
  selector: 'app-navbar',
  standalone: false,
  templateUrl: './navbar.html',
  styleUrl: './navbar.css'
})
export class Navbar {
// In your component.ts file
toggleMenu() {
  const navbarLinks = document.getElementById('navbar-links');
  const menuToggle = document.querySelector('.menu-toggle');
  
  navbarLinks?.classList.toggle('active');
  menuToggle?.classList.toggle('active');
}

}
