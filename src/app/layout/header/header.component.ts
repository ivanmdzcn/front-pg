import { Component, EventEmitter, Output} from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule], // ✅ Importar CommonModule para ngIf
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class HeaderComponent {
  @Output() menuToggle = new EventEmitter<void>();
  usuario: string = '';

  constructor(private router: Router) {}

    ngOnInit() {
    // ✅ OBTENER USUARIO AL INICIAR EL COMPONENTE
    this.usuario = localStorage.getItem('usuario') || '';
  }

  toggleSidebar() {
    this.menuToggle.emit();
  }

  logout() {
    localStorage.removeItem('token');   // limpia el token
    localStorage.removeItem('usuario'); // ✅ LIMPIAR TAMBIÉN EL USUARIO
    this.router.navigate(['/login']);   // y redirige al login
  }
}
