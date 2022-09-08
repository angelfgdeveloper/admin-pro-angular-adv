import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { delay } from 'rxjs/operators';

import Swal from 'sweetalert2';

import { Hospital } from '../../../models/hospital.model';

import { HospitalService } from '../../../services/hospital.service';
import { ModalImagenService } from '../../../services/modal-imagen.service';
import { BusquedasService } from '../../../services/busquedas.service';

@Component({
  selector: 'app-hospitales',
  templateUrl: './hospitales.component.html',
  styles: [
  ]
})
export class HospitalesComponent implements OnInit, OnDestroy {

  private imgSubs!: Subscription;
  public hospitales: Hospital[] = [];
  public cargando: boolean = true;

  public hospitalesTemp: Hospital[] = [];
  public totalHospitales: number = 0;
  public desde: number = 0;


  constructor(
    private hospitalService: HospitalService,
    private modalImagenService: ModalImagenService,
    private busquedasService: BusquedasService,
  ) { }

  ngOnInit(): void {
    this.cargarHospitales();

    this.imgSubs = this.modalImagenService.nuevaImagen.pipe(
      delay(100)
     ).subscribe(img => this.cargarHospitales());
  }

  ngOnDestroy(): void {
    this.imgSubs.unsubscribe();
  }

  cargarHospitales() {
    this.cargando = true;
    this.hospitalService.cargarHospitales(this.desde).subscribe(({ hospitales, total }) => {
      this.cargando = false;
      this.hospitales = hospitales;
      this.hospitalesTemp = hospitales;
      this.totalHospitales = total;
    });
  }

  buscar(termino: string) {
    if (termino.length === 0) {
      this.hospitales = [ ...this.hospitalesTemp ];
      return;
    }

    this.busquedasService.buscar('hospitales', termino).subscribe(resultados => {
      this.hospitales = resultados as Hospital[];
    });
  }

  cambiarPagina(valor: number) {
    this.desde += valor;

    if (this.desde < 0) {
      this.desde = 0; // no debe de ser menor de cero
    } else if (this.desde >= this.totalHospitales) {
      this.desde -= valor; // Evitar que se salga del total e la paginacion
    }

    this.cargarHospitales();
  }

  guardarCambios(hospital: Hospital) {
    const id = hospital.id;
    if (id) {
      this.hospitalService.actualizarHospital(id, hospital.nombre).subscribe(resp => {
        Swal.fire('Actualizado', hospital.nombre, 'success');
      });
    }

  }

  eliminarHospital(hospital: Hospital) {
    const id = hospital.id;
    if (id) {
      this.hospitalService.eliminarHospital(id).subscribe(resp => {
        this.cargarHospitales();
        Swal.fire('Eliminado', hospital.nombre, 'success');
      });
    }

  }

  async abrirSweetAlert() {
    const { value = '' } = await Swal.fire<string>({
      input: 'text',
      title: 'Crear hospital',
      inputLabel: 'Ingrese el nombre del nuevo Hospital',
      inputPlaceholder: 'Nombre del hospital',
      showCancelButton:true,
    });

    if (value.trim().length > 0) {
      this.hospitalService.crearHospital(value).subscribe((resp: any) => {
        const hospital: Hospital = resp.hospital;
        this.hospitales.push(hospital);
      });
    }

  }

  abrirModal(hospital: Hospital) {
    this.modalImagenService.abrirModal('hospitales', hospital.id!, hospital.img);
  }

}
