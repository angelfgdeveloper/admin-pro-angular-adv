import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

import { environment } from '../../environments/environment';

import { Usuario } from '../models/usuario.model';

const baseUrl = environment.baseUrl;

@Injectable({
  providedIn: 'root'
})
export class BusquedasService {

  constructor(
    private http: HttpClient,
  ) { }

  get token(): string {
    return localStorage.getItem('token') || '';
  }

  get headers() {
    return {
      headers: { 'x-token': this.token }
    }
  }

  private transformarUsuarios(resultados: any[]): Usuario[] {
    return resultados.map(user => new Usuario(
      user.nombre, user.email, '', user.img, user.google, user.role, user.uid)
    );
  }

  // /search/coleccion/usuarios/e
  buscar(
    tipo: 'usuarios' | 'medicos' | 'hospitales',
    termino: string = ''
  ) {
    const url = `${ baseUrl }/search/coleccion/${ tipo }/${ termino }`
    return this.http.get<any[]>(url, this.headers).pipe(
      map((resp: any) => {
        switch (tipo) {
          case 'usuarios':
            return this.transformarUsuarios(resp.resultados);

          default:
            return [];
        }
      })
    )
  }
}
