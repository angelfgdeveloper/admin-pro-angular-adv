import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { map } from 'rxjs/operators';

import { environment } from 'src/environments/environment';
import { Hospital } from '../models/hospital.model';

const baseUrl = environment.baseUrl;

@Injectable({
  providedIn: 'root'
})
export class HospitalService {

  constructor(
    private http: HttpClient,
    private router: Router,
  ) { }

  get token(): string {
    return localStorage.getItem('token') || '';
  }

  get headers() {
    return {
      headers: { 'x-token': this.token }
    }
  }

  cargarHospitales(desde: number = 0, limit: number = 0) {
    let url: string = '';
    if (limit === 0) {
      url = `${ baseUrl }/hospitales?desde=${ desde }`;
    } else {
      url = `${ baseUrl }/hospitales?desde=${ desde }&limit=${ limit }`;
    }

    return this.http.get<{ ok: boolean, total: number, hospitales: Hospital[] }>(url, this.headers,).pipe(
      map((resp: { ok: boolean, total: number, hospitales: Hospital[] } ) => ({ hospitales: resp.hospitales, total: resp.total }))
    );
  }

  crearHospital(nombre: string) {
    const url = `${ baseUrl }/hospitales`;
    return this.http.post(url, { nombre }, this.headers);
  }

  actualizarHospital(id: string, nombre: string) {
    const url = `${ baseUrl }/hospitales/${ id }`;
    return this.http.put(url, { nombre }, this.headers);
  }

  eliminarHospital(id: string) {
    const url = `${ baseUrl }/hospitales/${ id }`;
    return this.http.delete(url, this.headers);
  }

}
