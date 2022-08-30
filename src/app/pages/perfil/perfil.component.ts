import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import Swal from 'sweetalert2';

import { Usuario } from '../../models/usuario.model';

import { UsuarioService } from '../../services/usuario.service';
import { FileUploadService } from '../../services/file-upload.service';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styles: [
  ]
})
export class PerfilComponent implements OnInit {

  public perfilForm!: FormGroup;
  public usuario!: Usuario;
  public imagenSubir!: File;
  public imgTemp: any = null;

  constructor(
    private fb: FormBuilder,
    private usuarioService: UsuarioService,
    private fileUploadService: FileUploadService,
  ) {
    this.usuario = this.usuarioService.usuario;
  }

  ngOnInit(): void {
    this.perfilForm = this.fb.group({
      nombre: [this.usuario.nombre, Validators.required],
      email: [this.usuario.email, [Validators.required, Validators.email]],
    })
  }

  actualizarPerfil() {
    this.usuarioService.actualizarPerfil(this.perfilForm.value).subscribe({
      next: (resp: any) => {
        const { nombre, email } = resp.usuario; // ó this.perfilForm.value
        this.usuario.nombre = nombre;
        this.usuario.email = email;

        Swal.fire('Guardado', 'Los cambios fueron guardados', 'success');
      },
      error: (err) => {
        Swal.fire('Error', err.error.msg, 'error');
      }
    });
  }

  cambiarImagen(event: any) {
    const file: File = event.target.files[0] || '';
    this.imagenSubir = file;

    if (!file) {
      this.imgTemp = null;
      return;
    }

    const reader = new FileReader();
    // No se recomienda guardar imagen a base64
    reader.readAsDataURL(file); // Transformar a imagen a base64

    reader.onloadend = () => {
      this.imgTemp = reader.result;
      // console.log(reader.result);
    }
  }

  subirImagen() {
    this.fileUploadService
        .actualizarFoto(this.imagenSubir, 'usuarios', this.usuario.uid!)
        .then(img =>{
          this.usuario.img = img;
          Swal.fire('Guardado', 'Imágen de usuario actualizado', 'success');
        })
        .catch(err => {
          console.log(err);
          Swal.fire('Error', 'No se pudo subir la imágen', 'error');
        });
  }

}
