import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CausanteService } from '../../../services/causante.service';

@Component({
  selector: 'app-causante-edit',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './causante-edit.component.html',
  styleUrls: ['./causante-edit.component.css']
})
export class CausanteEditComponent implements OnInit {
  private fb = inject(FormBuilder);
  private srv = inject(CausanteService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  id!: number;
  loading = false;
  error = '';

  form = this.fb.group({
    //afi: ['', Validators.required],
    afi: [{ value: '', disabled: true }, Validators.required], // 👈 solo lectura
    nombre1: ['', Validators.required],
    nombre2: [''],
    apellido1: ['', Validators.required],
    apellido2: [''],
    direccion: ['', [Validators.required, Validators.minLength(5)]],
    dpi: ['', [Validators.required, Validators.pattern(/^\d{13}$/)]],
    estado: ['A', Validators.required],
    //usuario: ['usuario'] // puedes setear aquí el usuario logueado
  });

  get f() { return this.form.controls; }

  ngOnInit(): void {
    this.id = Number(this.route.snapshot.paramMap.get('id'));
    this.cargar();
  }

  cargar(): void {
    this.loading = true;
    this.error = '';
    this.srv.obtenerPorId(this.id).subscribe({
      next: (res) => {
        // res viene del back con las mismas claves (afi, nombre1, etc.)
        this.form.patchValue(res);
        this.loading = false;
      },
      error: (err) => {
        console.error(err);
        this.error = 'No se pudo cargar el causante.';
        this.loading = false;
      }
    });
  }

  guardar(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading = true;
    this.error = '';

    const dto = this.form.getRawValue(); // incluye controles deshabilitados (afi)

    this.srv.actualizar(this.id, dto as any).subscribe({
      next: () => {
        this.loading = false;
        this.router.navigate(['/causantes']);
      },
      error: (err) => {
        console.error(err);
        this.error = 'No se pudo actualizar el causante.';
        this.loading = false;
      }
    });
  }

  cancelar() {
    this.router.navigate(['/causantes']);
  }
}
