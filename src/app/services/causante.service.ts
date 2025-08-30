import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
// Ajusta la ruta si tu carpeta de environments está en otro lugar:
import { environment } from '../environments/environment';

const BASE_URL = `${environment.apiUrl}/Causante`;

export interface CausanteItem {
  codigo: number;
  afi: string;
  nombreCompleto: string;
  estado: string;          // 'A' | 'B'
  fechaRegistro: string;   // DD-MM-YYYY (desde el back)
}

// ---- DTOs de entrada ----
export interface CausanteCreate {
  afi: string;
  nombre1: string;
  nombre2?: string;
  apellido1: string;
  apellido2?: string;
  direccion: string;
  dpi: string;      // 13 dígitos
  estado: string;   // 'A' | 'B'
  usuario?: string; // lo agrega el servicio
}

export interface CausanteEdit {
  afi: string;
  nombre1: string;
  nombre2?: string;
  apellido1: string;
  apellido2?: string;
  direccion: string;
  dpi: string;
  estado: string;   // 'A' | 'B'
  usuario?: string; // lo agrega el servicio
}

@Injectable({ providedIn: 'root' })
export class CausanteService {
  private http = inject(HttpClient);

  listar(): Observable<CausanteItem[]> {
    return this.http.get<CausanteItem[]>(BASE_URL);
  }

  obtenerPorId(id: number): Observable<CausanteEdit> {
    return this.http.get<CausanteEdit>(`${BASE_URL}/${id}`);
  }

  crear(dto: CausanteCreate): Observable<{ mensaje: string }> {
    const usuario = this.getUsuarioLogueado();
    return this.http.post<{ mensaje: string }>(BASE_URL, { ...dto, usuario });
  }

  actualizar(id: number, dto: CausanteEdit): Observable<{ mensaje: string }> {
    const usuario = this.getUsuarioLogueado();
    return this.http.put<{ mensaje: string }>(`${BASE_URL}/${id}`, { ...dto, usuario });
  }

  eliminar(id: number): Observable<void> {
    return this.http.delete<void>(`${BASE_URL}/${id}`);
  }

  // ===== Helpers =====
  /**
   * Obtiene el nombre de usuario del localStorage o del payload del JWT.
   * Asegúrate de emitir los claims en el back (p.ej. "usuario", "unique_name", "name").
   */
  private getUsuarioLogueado(): string {
    // Si guardaste el usuario en localStorage al hacer login, úsalo directo
    const u = localStorage.getItem('usuario');
    if (u) return u;

    // Si no, intenta leerlo del JWT
    const token = localStorage.getItem('token');
    if (!token) return 'anonimo';

    try {
      const payload = JSON.parse(atob(token.split('.')[1] || ''));
      return (
        payload['usuario'] ||
        payload['unique_name'] ||
        payload['name'] ||
        payload['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'] ||
        payload['sub'] ||
        'anonimo'
      );
    } catch {
      return 'anonimo';
    }
  }
}
