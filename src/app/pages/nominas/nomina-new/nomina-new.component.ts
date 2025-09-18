import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NominaService } from '../../../services/nomina.service';

@Component({
  selector: 'app-nomina-new',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './nomina-new.component.html',
  styleUrls: ['./nomina-new.component.css']
})

export class NominaNewComponent {
  private fb = inject(FormBuilder);
  private svc = inject(NominaService);
  private router = inject(Router);

  loading = false;
  error = '';

  form = this.fb.group({
    nomtip: ['P', Validators.required],
    nomfdi: ['', Validators.required],
    nomfdf: ['', Validators.required],
  });

  guardar(){
    if (this.form.invalid) return;
    this.loading = true; this.error = '';
    const v = this.form.value as any;
    // Normaliza a 'YYYY-MM-DD'
    const dto = { nomtip: v.nomtip, nomfdi: v.nomfdi, nomfdf: v.nomfdf };
    this.svc.crear(dto).subscribe({
      next: r => this.router.navigate(['/nominas', r.nomcod]),
      error: _ => { this.error = 'No se pudo crear.'; this.loading = false; }
    });
  }

  cancel(){ this.router.navigate(['/nominas']); }
}
