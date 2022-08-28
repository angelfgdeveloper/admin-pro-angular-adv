import { Component, AfterViewInit, ViewChild, ElementRef, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, Validators } from '@angular/forms';

import Swal from 'sweetalert2';

import { UsuarioService } from 'src/app/services/usuario.service';

declare const google: any;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements AfterViewInit {

  @ViewChild('googleBtn') googleBtn!: ElementRef;

  public loginForm = this.fb.group({
    email: [localStorage.getItem('email') || 'test@test.com', [Validators.required, Validators.email]],
    password: ['123456', Validators.required],
    remember: [false],
  });

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private usuarioService: UsuarioService,
    private ngZone: NgZone, // Para indicarle a Angular que Google esta haciendo la navegación
  ) { }

  ngAfterViewInit(): void {
    this.googleInit();
  }

  googleInit(): void {
    google.accounts.id.initialize({
      client_id: "243070102075-muqci95ap61us022eipm2dho8dbnbgk7.apps.googleusercontent.com",
      // callback: this.handleCredentialResponse // Referencia al this de google
      callback: (response: any) => this.handleCredentialResponse(response) // Referencia al this de LoginComponent
    });

    google.accounts.id.renderButton(
      this.googleBtn.nativeElement,
      { theme: "outline", size: "large" }  // customization attributes
    );
  }

  handleCredentialResponse(response: any) {
    // console.log("Encoded JWT ID token: " + response.credential); // Token de Google
    this.usuarioService.loginGoogle(response.credential).subscribe(resp => {
      // console.log({ login: resp });
      this.ngZone.run(() => {
        this.router.navigateByUrl('/');
      });
    });
  }

  login() {
    this.usuarioService.login(this.loginForm.value).subscribe({
      next: (resp) => {
        if (this.loginForm.value.remember) {
          if (this.loginForm.value.email) {
            localStorage.setItem('email', this.loginForm.value.email);
          } else {
            localStorage.removeItem('email');
          }
        } else {
          localStorage.removeItem('email');
        }

        this.router.navigateByUrl('/');
      },
      error: (err) => {
        // Si sucede un error
        Swal.fire('Error', err.error.msg, 'error');
      },
    });

  }

}
