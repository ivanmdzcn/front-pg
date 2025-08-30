import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';

interface LoginRequest {
  usuario: string;
  contrasena: string;
}

export interface LoginResponse {
  token: string;
  mensaje?: string;
}

@Injectable({
  providedIn: 'root'
})

export class AuthService {
  //private apiUrl = 'http://localhost:3000/login'; // Ajusta la URL según tu backend
  // private apiUrl = 'https://localhost:44312/api/Login';
  private BASE_URL = `${environment.apiUrl}/Login`;

  constructor(private http: HttpClient) { }

  login(data: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(this.BASE_URL, data);
  }
}
