import { Component, OnInit } from '@angular/core';

import Swal from 'sweetalert2';

import { ModalImagenService } from '../../services/modal-imagen.service';
import { FileUploadService } from '../../services/file-upload.service';

@Component({
  selector: 'app-modal-imagen',
  templateUrl: './modal-imagen.component.html',
  styles: [
  ]
})
export class ModalImagenComponent implements OnInit {

  public imagenSubir!: File;
  public imgTemp: any = null;

  constructor(
    public modalImagenService: ModalImagenService,
    public fileUploadService: FileUploadService,
  ) { }

  ngOnInit(): void {
  }

  cerrarModal() {
    this.imgTemp = null;
    this.modalImagenService.cerrarModal();
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

    const id = this.modalImagenService.id;
    const tipo = this.modalImagenService.tipo;

    this.fileUploadService
        .actualizarFoto(this.imagenSubir, tipo, id)
        .then(img =>{
          Swal.fire('Guardado', 'Imágen de usuario actualizado', 'success');
          this.modalImagenService.nuevaImagen.emit(img);

          this.cerrarModal();
        })
        .catch(err => {
          console.log(err);
          Swal.fire('Error', 'No se pudo subir la imágen', 'error');
          this.cerrarModal();
        });
  }

}
