import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService, LoginResponse } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,                         // <-- ¡IMPORTANTE!
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']      // <-- plural y array
})

export class LoginComponent {
  usuario: string = '';
  contrasena: string = '';
  error: string = '';

  constructor(private authService: AuthService, private router: Router) { }

  login(): void {
    debugger;
    if (!this.usuario || !this.contrasena) {
      this.error = 'Ingrese usuario y contraseña.';
      return;
    }

    // Asegúrate de usar el nombre EXACTO que espera tu API (sin tilde):
    const body = {
      usuario: this.usuario,
      contrasena: this.contrasena            // <-- C# usa "Contrasena" => JSON "contrasena"
    };
    debugger;
    console.log('Datos enviados:', body);

    this.authService.login(body).subscribe({
      next: (res: LoginResponse) => {
        localStorage.setItem('token', res.token);
        // ✅ GUARDAR EL USUARIO EN LOCALSTORAGE
        localStorage.setItem('usuario', this.usuario);
        this.router.navigate(['/home']);
      },
      error: (err) => {
        console.error(err);
        this.error = 'Usuario o contraseña incorrecta.';
      }
    });
  }
  mostrarPassword: boolean = false;

  togglePassword() {
    this.mostrarPassword = !this.mostrarPassword;
  }
}
