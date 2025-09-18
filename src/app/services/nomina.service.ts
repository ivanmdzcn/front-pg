import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';

const BASE = `${environment.apiUrl}/Nomina`;

// ===== Interfaces que mapean el back =====
export interface NominaHdr {
  nomcod: number;
  nomtip: string;    // 'P'
  nomstd: string;    // 'B'|'A'|'C'
  nomfdi: string;    // ISO
  nomfdf: string;    // ISO
  nomudc: string;
  nomuda?: string | null;
  nomfau?: string | null;
}

export interface NominaDetalle {
  detcod: number;    // = nomcod
  detcau: number;
  detben: number;
  detmon: number;
}

export interface NominaPermisos {
  puedeVer: boolean;
  puedeEditarEncabezado: boolean;
  puedeAgregarDetalle: boolean;
  puedeEliminarDetalle: boolean;
  puedeAutorizar: boolean;
  puedeCancelar: boolean;
}

export interface NominaFull {
  nomcod: number;
  nomtip: string;
  nomstd: string;
  nomfdi: string;
  nomfdf: string;
  nomudc: string;
  nomuda?: string | null;
  nomfau?: string | null;
  detalle: NominaDetalle[];
  permisos: NominaPermisos;
}

// DTOs
export interface NominaCreateDto {
  nomtip: string;    // 'P'
  nomfdi: string;    // ISO
  nomfdf: string;    // ISO
}

export interface NominaDetCreateDto {
  detcau: number;
  detben: number;
  detmon: number;
}

export interface NominaDetUpdateDto {
  detmon: number;
}

@Injectable({ providedIn: 'root' })
export class NominaService {
  private http = inject(HttpClient);

  // Encabezado
  listar(): Observable<NominaHdr[]> {
    return this.http.get<NominaHdr[]>(BASE);
  }

  crear(dto: NominaCreateDto): Observable<{ nomcod: number; mensaje: string }> {
    return this.http.post<{ nomcod: number; mensaje: string }>(BASE, dto);
  }

  obtener(id: number): Observable<NominaFull> {
    return this.http.get<NominaFull>(`${BASE}/${id}`);
  }

  autorizar(id: number): Observable<{ mensaje: string }> {
    return this.http.post<{ mensaje: string }>(`${BASE}/${id}/autorizar`, {});
  }

  cancelar(id: number): Observable<{ mensaje: string }> {
    return this.http.post<{ mensaje: string }>(`${BASE}/${id}/cancelar`, {});
  }

  actualizarFechas(id: number, dto: NominaCreateDto): Observable<{ mensaje: string }> {
    return this.http.put<{ mensaje: string }>(`${BASE}/${id}/fechas`, dto);
  }

  // Detalle
  listarDetalle(id: number): Observable<NominaDetalle[]> {
    return this.http.get<NominaDetalle[]>(`${BASE}/${id}/detalle`);
  }

  agregarDetalle(id: number, dto: NominaDetCreateDto): Observable<{ mensaje: string }> {
    return this.http.post<{ mensaje: string }>(`${BASE}/${id}/detalle`, dto);
  }

  actualizarDetalle(id: number, cau: number, ben: number, dto: NominaDetUpdateDto): Observable<{ mensaje: string }> {
    return this.http.put<{ mensaje: string }>(`${BASE}/${id}/detalle/${cau}/${ben}`, dto);
  }

  eliminarDetalle(id: number, cau: number, ben: number): Observable<{ mensaje: string }> {
    return this.http.delete<{ mensaje: string }>(`${BASE}/${id}/detalle/${cau}/${ben}`);
  }
}
