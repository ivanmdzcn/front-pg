import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CausanteService } from '../../../services/causante.service';

@Component({
  selector: 'app-causante-create',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './causante-create.component.html',
  styleUrls: ['./causante-create.component.css']
})
export class CausanteCreateComponent {
  private fb = inject(FormBuilder);
  private srv = inject(CausanteService);
  private router = inject(Router);

  form = this.fb.group({
    afi: ['', [Validators.required]],
    nombre1: ['', [Validators.required]],
    nombre2: [''],
    apellido1: ['', [Validators.required]],
    apellido2: [''],
    direccion: ['', [Validators.required, Validators.minLength(5)]],
    dpi: ['', [Validators.required, Validators.pattern(/^\d{13}$/)]],
    estado: ['A', [Validators.required]],   // por defecto Activo
    //usuario: ['usuario']                      // puedes setear aquí el usuario logueado
  });

  error = '';
  loading = false;

  submit() {
    this.error = '';
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.loading = true;
    this.srv.crear(this.form.value as any).subscribe({
      next: () => {
        this.loading = false;
        this.router.navigate(['/causantes']);
      },
      error: (err) => {
        console.error(err);
        this.loading = false;
        this.error = 'No se pudo crear el causante.';
      }
    });
  }

  get f() { return this.form.controls; }

  cancelar() {
    this.router.navigate(['/causantes']);
  }
}
