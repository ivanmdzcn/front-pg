import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CausanteService, CausanteItem } from '../../../services/causante.service';
import { RouterModule } from '@angular/router';   // routerLink en el HTML
import { ConfirmService } from '../../../core/confirm/confirm.service';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged, startWith, switchMap } from 'rxjs';

@Component({
  selector: 'app-causante-list',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  templateUrl: './causante-list.component.html',
  styleUrls: ['./causante-list.component.css']
})
export class CausanteListComponent implements OnInit {
  private causanteSrv = inject(CausanteService);
  private confirmSrv = inject(ConfirmService);     // ✅ NUEVO

  loading = false;
  error = '';
  data: CausanteItem[] = [];

  // 🔎 Control para el campo de búsqueda
  search = new FormControl<string>('', { nonNullable: true });

  ngOnInit(): void {
    this.search.valueChanges.pipe(
      startWith(''),
      debounceTime(300),
      distinctUntilChanged(),
      switchMap(q => {
        this.loading = true;
        this.error = '';
        return this.causanteSrv.listar(q || '');
      })
    ).subscribe({
      next: (res) => {
        this.data = res;
        this.loading = false;
      },
      error: (err) => {
        console.error(err);
        this.error = 'No se pudo cargar la lista de causantes.';
        this.loading = false;
      }
    });
  }

  cargar(q: string = ''): void {
  this.loading = true;
  this.error = '';
  this.causanteSrv.listar(q).subscribe({
    next: (res) => { this.data = res; this.loading = false; },
    error: (err) => {
      console.error(err);
      this.error = 'No se pudo cargar la lista de causantes.';
      this.loading = false;
      }
    });
  }

  // ✅ CAMBIADO: ahora usa el modal y recibe el nombre para mostrarlo
  async confirmarEliminar(id: number, nombre: string): Promise<void> {
    const ok = await this.confirmSrv.confirm({
      title: 'Eliminar causante',
      message: `¿Seguro que deseas eliminar a: <b>${nombre}</b>? <br> Esta acción no se puede deshacer.`,
      confirmText: 'Sí, eliminar',
      cancelText: 'Cancelar',
      danger: true
    });
    if (!ok) return;

    this.causanteSrv.eliminar(id).subscribe({
      next: () => {
        this.data = this.data.filter(x => x.codigo !== id);
      },
      error: (err) => {
        console.error(err);
        if (err.status === 404) {
          alert('Causante no encontrado');
        } else if (err.status === 409) {
          alert('No se puede eliminar: el registro está referenciado');
        } else {
          alert('Error eliminando el causante');
        }
      }
    });
  }

  estadoTexto(sts: string): string {
    if (!sts) return '';
    return sts === 'A' ? 'Activo' : sts === 'B' ? 'Baja' : sts;
  }
}
