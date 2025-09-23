import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { ReportesService, NominaDetalleReporte } from '../../../services/reportes.service';

@Component({
  selector: 'app-reportes-detalle',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './reportes-detalle.component.html',
  styleUrls: ['./reportes-detalle.component.css']
})
export class ReportesDetalleComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private svc = inject(ReportesService);

  id = 0;
  loading = false;
  error: string | null = null;
  dto: NominaDetalleReporte | undefined;

  ngOnInit(): void {
    const param = this.route.snapshot.paramMap.get('id');
    const idNum = Number(param);
    if (!param || Number.isNaN(idNum)) {
      this.error = 'ID de nómina inválido.'; return;
    }
    this.id = idNum;

    this.loading = true;
    this.svc.detalleNomina(this.id).subscribe({
      next: (r) => { this.dto = r; this.loading = false; },
      error: () => { this.error = 'No se pudo cargar el detalle.'; this.loading = false; }
    });
  }

  descargar() {
    this.svc.descargarPdf(this.id).subscribe({
      next: blob => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `nomina_${this.id}.pdf`;
        a.click();
        window.URL.revokeObjectURL(url);
      },
      error: _ => alert('No se pudo generar el PDF.')
    });
  }
}
