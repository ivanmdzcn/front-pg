import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { NominaService, NominaDetalle, NominaFull } from '../../../services/nomina.service';
import { ConfirmService } from '../../../core/confirm/confirm.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-nomina-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  templateUrl: './nomina-detail.component.html',
  styleUrls: ['./nomina-detail.component.css'],
})

export class NominaDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private fb = inject(FormBuilder);
  private svc = inject(NominaService);
  private confirm = inject(ConfirmService);
  private router = inject(Router);

  id = 0;

  loading = false;
  error: string | null = null;

  // Datos del encabezado + permisos + detalle
  nomina: NominaFull | null = null;

  // Form para agregar renglón
  addForm = this.fb.group({
    detcau: [null as number | null, [Validators.required, Validators.min(1)]],
    detben: [null as number | null, [Validators.required, Validators.min(1)]],
    detmon: [null as number | null, [Validators.required, Validators.min(1)]],
  });

  // Edición en línea del monto
  editingKey: string | null = null;  // `${cau}-${ben}`
  editMonto = this.fb.control<number | null>(null, [Validators.required, Validators.min(1)]);

  ngOnInit(): void {
    this.id = Number(this.route.snapshot.paramMap.get('id'));
    this.cargar();
  }

  cargar(): void {
    this.loading = true;
    this.error = null;
    this.svc.obtener(this.id).subscribe({
      next: (dto) => {
        this.nomina = dto;
        this.loading = false;
      },
      error: (err) => {
        console.error(err);
        this.error = 'No se pudo cargar la nómina.';
        this.loading = false;
      },
    });
  }

  // === Acciones de encabezado (admin) ===
  autorizar(): void {
    if (!this.nomina) return;
    this.confirm.confirm({
      title: 'Autorizar nómina',
      message: `¿Autorizar la nómina #${this.nomina.nomcod}?`,
      confirmText: 'Sí, autorizar',
      cancelText: 'Cancelar',
      danger: false,
    }).then((ok: boolean) => {
      if (!ok) return;
      this.svc.autorizar(this.id).subscribe({
        next: () => this.cargar(),
        error: () => alert('No se pudo autorizar.'),
      });
    });
  }

  cancelar(): void {
    if (!this.nomina) return;
    this.confirm.confirm({
      title: 'Cancelar nómina',
      message: `¿Cancelar la nómina #${this.nomina.nomcod}?`,
      confirmText: 'Sí, cancelar',
      cancelText: 'Volver',
      danger: true,
    }).then((ok: boolean) => {
      if (!ok) return;
      this.svc.cancelar(this.id).subscribe({
        next: () => this.cargar(),
        error: () => alert('No se pudo cancelar.'),
      });
    });
  }

  // === Detalle ===
  agregar(): void {
    if (!this.nomina?.permisos.puedeAgregarDetalle) return;
    if (this.addForm.invalid) { this.addForm.markAllAsTouched(); return; }

    const dto = this.addForm.getRawValue();
    this.svc.agregarDetalle(this.id, {
      detcau: dto.detcau!,   // validado por el form
      detben: dto.detben!,
      detmon: dto.detmon!,
    }).subscribe({
      next: () => {
        this.addForm.reset();
        this.cargar();
      },
      error: (err) => {
        console.error(err);
        alert('No se pudo agregar el detalle.');
      },
    });
  }

  startEdit(row: NominaDetalle): void {
    if (!this.nomina?.permisos.puedeAgregarDetalle) return;
    this.editingKey = `${row.detcau}-${row.detben}`;
    this.editMonto.setValue(row.detmon);
  }

  saveEdit(row: NominaDetalle): void {
    if (this.editMonto.invalid) { this.editMonto.markAsTouched(); return; }
    const monto = Number(this.editMonto.value);
    this.svc.actualizarDetalle(this.id, row.detcau, row.detben, { detmon: monto })
      .subscribe({
        next: () => {
          this.editingKey = null;
          this.cargar();
        },
        error: () => alert('No se pudo actualizar el monto.'),
      });
  }

  cancelEdit(): void { this.editingKey = null; }

  eliminar(row: NominaDetalle): void {
    if (!this.nomina?.permisos.puedeEliminarDetalle) return;
    this.confirm.confirm({
      title: 'Eliminar renglón',
      message: `Quitar CAU=${row.detcau} / BEN=${row.detben} de la nómina?`,
      confirmText: 'Eliminar',
      cancelText: 'Cancelar',
      danger: true,
    }).then((ok: boolean) => {
      if (!ok) return;
      this.svc.eliminarDetalle(this.id, row.detcau, row.detben).subscribe({
        next: () => this.cargar(),
        error: () => alert('No se pudo eliminar.'),
      });
    });
  }

  badgeEstado(cod: string): string {
    switch ((cod || '').trim()) {
      case 'B': return 'Borrador';
      case 'A': return 'Autorizada';
      case 'C': return 'Cancelada';
      default: return cod || '';
    }
  }

  cancel() { this.router.navigate(['/nominas']); }
}
