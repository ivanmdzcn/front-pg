import { Component, EventEmitter, Output } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class HeaderComponent {
  @Output() menuToggle = new EventEmitter<void>();

  constructor(private router: Router) {}

  toggleSidebar() {
    this.menuToggle.emit();
  }

  logout() {
    localStorage.removeItem('token');   // limpia el token
    this.router.navigate(['/login']);   // y redirige al login
  }
}
