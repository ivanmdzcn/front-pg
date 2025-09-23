import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ReportesService, NominaResumen } from '../../../services/reportes.service';

@Component({
  selector: 'app-reportes-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './reportes-list.component.html',
  styleUrls: ['./reportes-list.component.css']
})
export class ReportesListComponent implements OnInit {
  private svc = inject(ReportesService);

  loading = false;
  error: string | null = null;
  data: NominaResumen[] = [];

  ngOnInit(): void {
    this.loading = true;
    this.svc.listarAutorizadas().subscribe({
      next: (rows) => { this.data = rows ?? []; this.loading = false; },
      error: () => { this.error = 'No se pudo cargar.'; this.loading = false; }
    });
  }
}
