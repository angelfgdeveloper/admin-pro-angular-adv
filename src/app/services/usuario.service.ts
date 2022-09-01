import { HttpClient } from '@angular/common/http';
import { Injectable, NgZone } from '@angular/core';
import { Router } from '@angular/router';

import { tap, map, catchError, delay } from 'rxjs/operators';
import { Observable, of } from 'rxjs';

import { environment } from '../../environments/environment';

import { Usuario } from '../models/usuario.model';

import { LoginForm } from '../interfaces/login-form.interface';
import { RegisterForm } from '../interfaces/register-form.interface';
import { CargarUsuario } from '../interfaces/cargar-usuarios.interface';

const baseUrl = environment.baseUrl;

declare const google: any; // Para objeto global que usa google

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  public usuario!: Usuario;

  constructor(
    private http: HttpClient,
    private router: Router,
    private ngZone: NgZone, // Para indicarle a Angular que Google esta haciendo la navegación
  ) { }

  get token(): string {
    return localStorage.getItem('token') || '';
  }

  get uid(): string {
    return this.usuario.uid || '';
  }

  get headers() {
    return {
      headers: { 'x-token': this.token }
    }
  }

  validarToken(): Observable<boolean> {
    return this.http.get(`${ baseUrl }/login/renew`, {
      headers: { 'x-token': this.token }
    }).pipe(
      map((resp: any) => {
        const { email, google, nombre, role, img = '', uid } = resp.usuario;
        this.usuario = new Usuario(nombre, email, '', img, google, role, uid);
        localStorage.setItem('token', resp.token);

        return true;
      }),
      // map(resp => true),
      catchError(err => of(false)) // Atrapa el error y regresa con of un observable
    );

  }

  crearUsuario(formData: RegisterForm) {
    // console.log('Creando usuario');
    // console.log(formData);
    return this.http.post(`${ baseUrl }/usuarios`, formData).pipe(
      tap((resp: any) => {
        localStorage.setItem('token', resp.token);
      }),
    );
  }

  actualizarPerfil( data: { email: string, nombre: string, role: string } ) {
    data = {
      ...data,
      role: this.usuario.role || ''
    };

    return this.http.put(`${ baseUrl }/usuarios/${ this.uid }`, data, this.headers);
  }

  login(formData: any) {
    const formLogin: LoginForm = formData;
    return this.http.post(`${ baseUrl }/login`, formLogin).pipe(
      tap((resp: any) => {
        localStorage.setItem('token', resp.token);
      }),
    );
  }

  loginGoogle(token: string) {
    return this.http.post(`${ baseUrl }/login/google`, { token }).pipe(
      tap((resp: any) => {
        localStorage.setItem('token', resp.token);
      }),
    );
  }

  logout() {
    localStorage.removeItem('token');

    if (this.usuario.google) {
      google.accounts.id.revoke(this.usuario.email, () => {
        this.ngZone.run(() => {
          this.router.navigateByUrl('/login');
        });
      });
    } else {
      this.ngZone.run(() => {
        this.router.navigateByUrl('/login');
      });
    }
  }

  cargarUsuarios(desde: number = 0) {
    const url = `${ baseUrl }/usuarios?desde=${ desde }`
    return this.http.get<CargarUsuario>(url, this.headers).pipe(
      delay(500),
      map(resp => {
        // console.log(resp);

        const usuarios = resp.usuarios.map(user => new Usuario(
          user.nombre, user.email, '', user.img, user.google, user.role, user.uid)
        );

        return {
          total: resp.total,
          usuarios
        };
      })
    );
  }

  eliminarUsuario(usuario: Usuario) {
    const url = `${ baseUrl }/usuarios/${ usuario.uid }`
    return this.http.delete(url, this.headers);
  }

  guardarUsuario( usuario: Usuario ) {
    return this.http.put(`${ baseUrl }/usuarios/${ usuario.uid }`, usuario, this.headers);
  }

}
