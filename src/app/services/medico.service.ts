import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

import { map } from 'rxjs/operators';

import { environment } from 'src/environments/environment';

import { Medico } from '../models/medico.model';

const baseUrl = environment.baseUrl;

@Injectable({
  providedIn: 'root'
})
export class MedicoService {
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

  cargarMedicos(desde: number = 0) {
    const url = `${ baseUrl }/medicos?desde=${ desde }`;
    return this.http.get<{ ok: boolean, total: number, medicos: Medico[] }>(url, this.headers,).pipe(
      map((resp: { ok: boolean, total: number, medicos: Medico[] } ) => ({ medicos: resp.medicos, total: resp.total }))
    );
  }

  obtenerMedicoPorId(id: string) {
    const url = `${ baseUrl }/medicos/${ id }`;
    return this.http.get<{ ok: boolean, medico: Medico }>(url, this.headers).pipe(
      map((resp: { ok: boolean, medico: Medico } ) => ({ medico: resp.medico }))
    );
  }

  crearMedico(medico: { nombre: string, hospital: string }) {
    const url = `${ baseUrl }/medicos`;
    return this.http.post(url, medico, this.headers);
  }

  actualizarMedico(medico: Medico) {
    const url = `${ baseUrl }/medicos/${ medico.id }`;
    return this.http.put(url, medico, this.headers);
  }

  eliminarMedico(medico: Medico) {
    const id = medico.id;
    const url = `${ baseUrl }/medicos/${ id }`;
    return this.http.delete(url, this.headers);
  }
}
