import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
// ⚠️ Ajusta esta ruta si tu environments está en otra carpeta
import { environment } from '../environments/environment';

const BASE_URL = `${environment.apiUrl}/Beneficiario`;

export interface BeneficiarioItem {
  bencau: number;
  bencod: number;
  bennoc: string;
  bendpi: string;
  benpar: string;   // '1','2',...
  benmon: number;
  bensit: string;   // 'V','T'
}

export interface BeneficiarioCreate {
  bencau: number;
  bencod: number;       // lo ingresa el usuario
  benno1: string;
  benno2?: string | null;
  benap1: string;
  benap2?: string | null;
  benres: string;
  bendpi: string;       // 13 dígitos
  benpar: string;       // '1','2',...
  benmon: number;
  bensit?: string | null; // 'V','T' o null
  bentrm?: number | null;
  benate?: number | null;
  benudg: string;
}

export interface BeneficiarioEdit {
  bencau: number;
  bencod: number;
  benno1: string;
  benno2?: string | null;
  benap1: string;
  benap2?: string | null;
  benres: string;
  bendpi: string;
  benpar: string;
  benmon: number;
  bensit?: string | null;
  bentrm?: number | null;
  benate?: number | null;
  benudg?: string | null;
}

@Injectable({ providedIn: 'root' })
export class BeneficiarioService {
  private http = inject(HttpClient);

  // GET /api/Beneficiario?causanteId=#
  listarPorCausante(causanteId: number): Observable<BeneficiarioItem[]> {
    const params = new HttpParams().set('causanteId', String(causanteId));
    return this.http.get<BeneficiarioItem[]>(BASE_URL, { params });
  }

  // POST /api/Beneficiario
  crear(dto: BeneficiarioCreate): Observable<{ mensaje: string }> {
    return this.http.post<{ mensaje: string }>(BASE_URL, dto);
  }

  obtenerUno(bencau: number, bencod: number): Observable<BeneficiarioEdit> {
    // asumo endpoint GET /api/Beneficiario/{bencau}/{bencod}
    return this.http.get<BeneficiarioEdit>(`${BASE_URL}/${bencau}/${bencod}`);
  }

  actualizar(dto: BeneficiarioEdit): Observable<{ mensaje: string }> {
    // asumo endpoint PUT /api/Beneficiario/{bencau}/{bencod}
    return this.http.put<{ mensaje: string }>(
      `${BASE_URL}/${dto.bencau}/${dto.bencod}`, dto
    );
  }

  eliminar(bencau: number, bencod: number) {
    return this.http.delete<{ mensaje: string }>(`${BASE_URL}/${bencau}/${bencod}`);
  }
  
}


