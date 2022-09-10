import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, Router, CanLoad, Route, UrlSegment, UrlTree } from '@angular/router';
import { Observable, tap } from 'rxjs';

import { UsuarioService } from '../services/usuario.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate, CanLoad {

  constructor(
    private usuarioService: UsuarioService,
    private router: Router
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ) {
    // console.log('Paso por el canActivate');
    // this.usuarioService.validarToken().subscribe(resp => {
    //   console.log(resp);
    // });
    return this.usuarioService.validarToken().pipe(
      tap(isAuth => {
        if (!isAuth) {
          this.router.navigateByUrl('/login');
        }
      })
    ); // Retorna el valor
  }

  // Solo carga si el usuario tiene acceso a esa ruta
  canLoad(route: Route, segments: UrlSegment[]): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
    return this.usuarioService.validarToken().pipe(
      tap(isAuth => {
        if (!isAuth) {
          this.router.navigateByUrl('/login');
        }
      })
    ); // Retorna el valor
  }

}
