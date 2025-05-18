import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Usuario } from './usuario';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  // Usa ruta relativa para que funcione con NGINX y también en desarrollo si configuras proxy
  private basedURL = '/api';

  constructor(private httpClient: HttpClient) {}

  consultarUsuario(code: string, contrasena: string): Observable<Usuario> {
    return this.httpClient.get<Usuario>(`${this.basedURL}/login/${code}/${contrasena}`).pipe(
      tap((usuario: Usuario) => {
        localStorage.setItem('usuarioRegistrado', JSON.stringify(usuario));
      })
    );
  }

  borrarCache(): void {
    localStorage.clear();
  }
}
