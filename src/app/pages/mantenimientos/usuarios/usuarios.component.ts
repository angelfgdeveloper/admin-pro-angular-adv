import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { delay } from 'rxjs/operators';

import Swal from 'sweetalert2';

import { Usuario } from '../../../models/usuario.model';

import { UsuarioService } from '../../../services/usuario.service';
import { BusquedasService } from '../../../services/busquedas.service';
import { ModalImagenService } from '../../../services/modal-imagen.service';

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styles: [
  ]
})
export class UsuariosComponent implements OnInit, OnDestroy {

  public totalUsuarios: number = 0;
  public usuarios: Usuario[] = [];
  public usuariosTemp: Usuario[] = [];

  public imgSubs!: Subscription;
  public desde: number = 0;
  public cargando: boolean = true;

  constructor(
    private usuarioService: UsuarioService,
    private busquedasService: BusquedasService,
    private modalImagenService: ModalImagenService,
  ) { }

  ngOnInit(): void {
   this.cargarUsuarios();

   this.imgSubs = this.modalImagenService.nuevaImagen.pipe(
    delay(100)
   ).subscribe(img => this.cargarUsuarios())
  }

  ngOnDestroy(): void {
    this.imgSubs.unsubscribe();
  }

  cargarUsuarios() {
    this.cargando = true;
    this.usuarioService.cargarUsuarios(this.desde).subscribe(({ total, usuarios}) => {
      this.totalUsuarios = total;
      // Otra idea para no poner mas páginas
      // if (usuarios.length !== 0) {
      //   this.usuarios = usuarios;
      // }
      this.usuarios = usuarios;
      this.usuariosTemp = usuarios;
      this.cargando = false;
    });
  }

  cambiarPagina(valor: number) {
    this.desde += valor;

    if (this.desde < 0) {
      this.desde = 0; // no debe de ser menor de cero
    } else if (this.desde >= this.totalUsuarios) {
      this.desde -= valor; // Evitar que se salga del total e la paginacion
    }

    this.cargarUsuarios();
  }

  buscar(termino: string) {
    if (termino.length === 0) {
      this.usuarios = [ ...this.usuariosTemp ];
      return;
    }

    this.busquedasService.buscar('usuarios', termino).subscribe(resultados => {
      this.usuarios = resultados;
    });
  }

  eliminarUsuario(usuario: Usuario) {

    if (usuario.uid === this.usuarioService.uid) {
      Swal.fire('Error', 'No puede borrar su correo', 'error');
      return;
    }

    Swal.fire({
      title: '¿Borrar usuario?',
      text: `Esta apunto de eliminar a ${ usuario.nombre }`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Si, borrarlo'
    }).then((result) => {
      if (result.isConfirmed) {
        this.usuarioService.eliminarUsuario(usuario).subscribe(reps => {
          this.cargarUsuarios();

          Swal.fire(
            'Usuario borrado',
            `${ usuario.nombre } fue eliminado correctamente`,
            'success'
          );
        });
      }
    });

  }

  cambiarRole(usuario: Usuario) {
    this.usuarioService.guardarUsuario(usuario).subscribe(resp => {
      console.log(resp);
    });
  }

  abrirModal(usuario: Usuario) {
    // console.log(usuario);
    this.modalImagenService.abrirModal('usuarios', usuario.uid!, usuario.img);
  }

}
