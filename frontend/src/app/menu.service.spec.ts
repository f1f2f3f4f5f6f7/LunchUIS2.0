import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MenuService {

  constructor(private http: HttpClient) { }

  crearMenu(menuData: FormData): Observable<any> {
    return this.http.post('http://localhost/api/menus', menuData);
  }
}

