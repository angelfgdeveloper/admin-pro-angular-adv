import { Component, OnInit, OnDestroy } from '@angular/core';
import { delay } from 'rxjs/operators';
import { Subscription } from 'rxjs';

import Swal from 'sweetalert2';

import { Medico } from '../../../models/medico.model';

import { MedicoService } from '../../../services/medico.service';
import { ModalImagenService } from '../../../services/modal-imagen.service';
import { BusquedasService } from '../../../services/busquedas.service';

@Component({
  selector: 'app-medicos',
  templateUrl: './medicos.component.html',
  styles: [
  ]
})
export class MedicosComponent implements OnInit, OnDestroy {

  private imgSubs!: Subscription;
  public cargando: boolean = true;
  public medicos: Medico[] = [];

  public medicosTemp: Medico[] = [];
  public totalMedicos: number = 0;
  public desde: number = 0;

  constructor(
    private medicoService: MedicoService,
    private modalImagenService: ModalImagenService,
    private busquedasService: BusquedasService,
  ) { }

  ngOnInit(): void {
    this.cargarMedicos();

    this.imgSubs = this.modalImagenService.nuevaImagen.pipe(
      delay(100)
     ).subscribe(img => this.cargarMedicos());
  }

  ngOnDestroy(): void {
    this.imgSubs.unsubscribe();
  }

  cargarMedicos() {
    this.cargando = true;
    this.medicoService.cargarMedicos(this.desde).subscribe(({ medicos, total }) => {
      this.cargando = false;
      this.medicos = medicos;
      this.medicosTemp = medicos;
      this.totalMedicos = total;
    });
  }

  buscar(termino: string) {
    if (termino.length === 0) {
      this.medicos = [ ...this.medicosTemp ];
      return;
    }

    this.busquedasService.buscar('medicos', termino).subscribe(resultados => {
      this.medicos = resultados as Medico[];
    });
  }

  cambiarPagina(valor: number) {
    this.desde += valor;

    if (this.desde < 0) {
      this.desde = 0; // no debe de ser menor de cero
    } else if (this.desde >= this.totalMedicos) {
      this.desde -= valor; // Evitar que se salga del total e la paginacion
    }

    this.cargarMedicos();
  }

  borrarMedico(medico: Medico) {
    Swal.fire({
      title: '¿Borrar usuario?',
      text: `Esta apunto de eliminar a ${ medico.nombre }`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Si, borrarlo'
    }).then((result) => {
      if (result.isConfirmed) {
        this.medicoService.eliminarMedico(medico).subscribe(resp => {
          this.cargarMedicos();

          Swal.fire(
            'Médico borrado',
            `${ medico.nombre } fue eliminado correctamente`,
            'success'
          );
        });
      }
    });
  }

  abrirModal(medico: Medico) {
    this.modalImagenService.abrirModal('medicos', medico.id!, medico.img);
  }

}
