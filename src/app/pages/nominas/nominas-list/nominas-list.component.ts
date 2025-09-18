import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NominaService, NominaHdr } from '../../../services/nomina.service';

@Component({
  selector: 'app-nominas-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: `./nominas-list.component.html`,
  styleUrls: [`./nominas-list.component.css`]
})

export class NominasListComponent implements OnInit {
  private svc = inject(NominaService);

  loading = false;
  error = '';
  data: NominaHdr[] = [];

  ngOnInit(){ this.cargar(); }

  cargar(){
    this.loading = true; this.error = '';
    this.svc.listar().subscribe({
      next: res => { this.data = res; this.loading = false; },
      error: _ => { this.error = 'No se pudo cargar.'; this.loading = false; }
    });
  }

  estado(s: string){ return s==='B'?'Borrador': s==='A'?'Autorizada': s==='C'?'Cancelada': s; }
}
