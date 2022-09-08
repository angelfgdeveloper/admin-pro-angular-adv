import { Pipe, PipeTransform } from '@angular/core';

import { environment } from 'src/environments/environment';

const baseUrl = environment.baseUrl;

@Pipe({
  name: 'imagen'
})
export class ImagenPipe implements PipeTransform {

  transform(img: string, tipo: 'usuarios' | 'medicos' | 'hospitales' ): string {

    // /upload/usuarios/no-image
    if (!img) {
      return `${ baseUrl }/upload/${ tipo }/no-image`;
    } else if (img.includes('https')) {
      return img;
    } else if (img) {
      return `${ baseUrl }/upload/${ tipo }/${ img }`;
    } else {
      return `${ baseUrl }/upload/${ tipo }/no-image`;
    }
  }

}
