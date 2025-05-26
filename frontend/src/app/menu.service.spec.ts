import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MenuService {

  private apiUrl = '/api/combos';

  constructor(private http: HttpClient) { }

  // Llamada para obtener los combos
  obtenerCombos(): Observable<any> {
    return this.http.get<any>(this.apiUrl);
  }



  crearMenu(menuData: any): Observable<any> {
    // Aquí enviamos como JSON, no FormData
    return this.http.post(this.apiUrl, menuData, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
}


