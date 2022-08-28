import { HttpClient } from '@angular/common/http';
import { Injectable, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { tap, map, catchError } from 'rxjs/operators';
import { Observable, of } from 'rxjs';

import { environment } from '../../environments/environment';

import { RegisterForm } from '../interfaces/register-form.interface';
import { LoginForm } from '../interfaces/login-form.interface';

const baseUrl = environment.baseUrl;

declare const google: any; // Para objeto global que usa google

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  constructor(
    private http: HttpClient,
    private router: Router,
    private ngZone: NgZone, // Para indicarle a Angular que Google esta haciendo la navegación
  ) { }

  validarToken(): Observable<boolean> {
    const token = localStorage.getItem('token') || '';

    return this.http.get(`${ baseUrl }/login/renew`, {
      headers: {
        'x-token': token
      }
    }).pipe(
      tap((resp: any) => {
        localStorage.setItem('token', resp.token);
      }),
      map(resp => true),
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
    google.accounts.id.revoke('correo - electronico de Google', () => {
      this.ngZone.run(() => {
        this.router.navigateByUrl('/login');
      });
    });
  }

}
