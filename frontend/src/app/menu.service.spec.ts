import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MenuService {

  constructor(private http: HttpClient) { }

  crearMenu(menuData: any): Observable<any> {
    // Aquí enviamos como JSON, no FormData
    return this.http.post('http://localhost/api/combos', menuData, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
}


