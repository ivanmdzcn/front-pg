import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environments/environment';

export interface NominaResumen {
  nomcod: number;
  nomtip: string;
  nomfdi: string;
  nomfdf: string;
  nomudc: string;
  totalBeneficiarios: number;
  totalMonto: number;
}

export interface NominaDetalleLinea {
  detcod: number;  // = nomcod
  detcau: number;
  detben: number;
  detmon: number;
  // NUEVO
  causanteNombre?: string | null;
  beneficiarioNombre?: string | null;
}

export interface NominaDetalleReporte {
  nomcod: number;
  totalBeneficiarios: number;
  totalMonto: number;
  lineas: NominaDetalleLinea[];
}

@Injectable({ providedIn: 'root' })
export class ReportesService {
  private http = inject(HttpClient);
  private BASE = `${environment.apiUrl}/Reportes`;

  listarAutorizadas() {
    return this.http.get<NominaResumen[]>(`${this.BASE}/nominas-autorizadas`);
  }

  detalleNomina(nomcod: number) {
    return this.http.get<NominaDetalleReporte>(`${this.BASE}/nomina/${nomcod}/detalle`);
  }

  //PDF
  descargarPdf(nomcod: number) {
    const url = `${this.BASE}/nomina/${nomcod}/pdf`;
    return this.http.get(url, { responseType: 'blob' });
  }
}


