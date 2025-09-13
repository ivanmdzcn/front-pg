import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { CausanteService, CausanteEdit } from '../../../services/causante.service';
import { BeneficiarioService, BeneficiarioItem } from '../../../services/beneficiario.service';
import { RouterModule } from '@angular/router'; // ⬅️ arriba
import { ConfirmService } from '../../../core/confirm/confirm.service';

@Component({
  selector: 'app-beneficiarios-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './beneficiarios-list.component.html',
  styleUrls: ['./beneficiarios-list.component.css']
})
export class BeneficiariosListComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private causanteSrv = inject(CausanteService);
  private benefSrv = inject(BeneficiarioService);
  private confirmSrv = inject(ConfirmService);

  causanteId = 0;

  // Header (verde)
  headerLoading = false;
  headerError: string | null = null;

  afi = '';
  nombreCompleto = '';

  // Detalle (tabla roja)
  listLoading = false;
  listError: string | null = null;
  data: BeneficiarioItem[] = [];


  ngOnInit(): void {
    this.causanteId = Number(this.route.snapshot.paramMap.get('causanteId'));
    this.cargarHeader();
    this.cargarDetalle();
  }

  private cargarHeader(): void {
    this.headerLoading = true;
    this.headerError = null;

    this.causanteSrv.obtenerPorId(this.causanteId).subscribe({
      next: (c: CausanteEdit) => {
        this.afi = c.afi ?? '';
        this.nombreCompleto = this.armarNombre(c);
        this.headerLoading = false;
      },
      error: (err) => {
        console.error(err);
        this.headerError = 'No se pudo cargar los datos del causante.';
        this.headerLoading = false;
      }
    });
  }

  private cargarDetalle(): void {
    this.listLoading = true;
    this.listError = null;

    this.benefSrv.listarPorCausante(this.causanteId).subscribe({
      next: (res) => {
        this.data = res;
        this.listLoading = false;
      },
      error: (err) => {
        console.error(err);
        this.listError = 'No se pudo cargar beneficiarios.';
        this.listLoading = false;
      }
    });
  }

  private armarNombre(c: CausanteEdit): string {
    // une nombre1 nombre2 apellido1 apellido2 (ignorando null/'' y normalizando espacios)
    return [c.nombre1, c.nombre2, c.apellido1, c.apellido2]
      .filter(Boolean)
      .join(' ')
      .replace(/\s+/g, ' ')
      .trim();
  }

  parentescoTexto(cod: string): string {
    switch ((cod || '').trim()) {
      case '1': return 'Esposa';
      case '2': return 'Compañera de hecho';
      default: return cod || '';
    }
  }

  situacionTexto(cod: string): string {
    switch ((cod || '').trim()) {
      case 'V': return 'Vigente';
      case 'T': return 'Terminado';
      default: return cod || '';
    }
  }

async confirmarEliminar(bencod: number, nombre: string): Promise<void> {
  const ok = await this.confirmSrv.confirm({
    title: 'Eliminar beneficiario',
    message: `¿Seguro que deseas eliminar a: <b>${nombre}</b>?<br>Esta acción no se puede deshacer.`,
    confirmText: 'Sí, eliminar',
    cancelText: 'Cancelar',
    danger: true
  });
  if (!ok) return;

  this.benefSrv.eliminar(this.causanteId, bencod).subscribe({
    next: () => {
      // quita de la tabla sin recargar
      this.data = this.data.filter(x => x.bencod !== bencod);
    },
    error: (err) => {
      console.error(err);
      if (err.status === 404) {
        alert('Beneficiario no encontrado');
      } else if (err.status === 409) {
        // 409 lo devuelve el back cuando hay restricción FK (referenciado)
        alert('No se puede eliminar: el registro está referenciado');
      } else {
        alert('Error eliminando el beneficiario');
      }
    }
  });
}


}

