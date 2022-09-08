import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';

import Swal from 'sweetalert2';

import { Medico } from '../../../models/medico.model';
import { Hospital } from '../../../models/hospital.model';

import { HospitalService } from '../../../services/hospital.service';
import { MedicoService } from '../../../services/medico.service';
import { delay } from 'rxjs/operators';

@Component({
  selector: 'app-medico',
  templateUrl: './medico.component.html',
  styles: [
  ]
})
export class MedicoComponent implements OnInit {

  public medicoForm!: FormGroup;
  public hospitales: Hospital[] = [];

  public medicoSeleccionado?: Medico;
  public hospitalSeleccionado?: Hospital;

  constructor(
    private fb: FormBuilder,
    private hospitalService: HospitalService,
    private medicoService: MedicoService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
  ) { }

  ngOnInit(): void {
    // Obtener id de médico en ruta
    this.activatedRoute.params.subscribe(({ id }) => this.cargarMedico(id));

    this.cargarHospitales();

    this.medicoForm = this.fb.group({
      nombre: ['', Validators.required],
      hospital: ['', Validators.required],
    });

    this.medicoForm.get('hospital')?.valueChanges.subscribe(hospitalId => {
      this.hospitalSeleccionado = this.hospitales.find(h => h.id === hospitalId);
    });

  }

  cargarMedico(idMedico: string) {

    if (idMedico === 'nuevo') { return; }

    this.medicoService.obtenerMedicoPorId(idMedico).pipe(
      delay(100)
    ).subscribe({
      next: ({ medico }) => {
      this.medicoSeleccionado = medico;

      const { nombre, hospital } = medico;
      if (hospital) {
        const { id } = hospital;
        this.medicoForm.setValue({ nombre, hospital: id });
      }
    },
    error: (err) => {
      const { error : { errors } } = err;
      const { id: { msg: mensaje } } = errors;
      if (err) {
        Swal.fire('Error', `${ mensaje }`, 'error');
        this.router.navigateByUrl(`/dashboard/medicos`);
        return;
      }
    }});
  }

  cargarHospitales() {
    this.hospitalService.cargarHospitales(0, 100).subscribe(({ hospitales }) => {
      this.hospitales = hospitales;
    });
  }

  guardarMedico() {
    const { nombre } = this.medicoForm.value;

    if (this.medicoSeleccionado) {
      // Actualizar
      const data = {
        ...this.medicoForm.value,
        id: this.medicoSeleccionado.id
      }

      this.medicoService.actualizarMedico(data).subscribe(resp => {
        Swal.fire('Actualizado', `${ nombre } actualizado correctamente`, 'success');
      });
    } else {
      // Crear
      this.medicoService.crearMedico(this.medicoForm.value).subscribe((resp: any) => {
        Swal.fire('Creado', `${ nombre } creado correctamente`, 'success');
        this.router.navigateByUrl(`/dashboard/medico/${ resp.medico.id }`);
      });
    }

  }

}
