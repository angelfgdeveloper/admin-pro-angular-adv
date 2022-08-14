import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-promesas',
  templateUrl: './promesas.component.html',
  styles: [
  ]
})
export class PromesasComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
    // this.usoDePromesas()
    // this.getUsuarios();
    this.getUsuarios().then(usuarios => {
      console.log(usuarios);
    });
  }

  usoDePromesas() {

    const promesa = new Promise((resolve, reject) => {

      if (!true) {
        resolve('Hola mundo');
      } else {
        reject('Algo salio mal');
      }

    });

    promesa.then((mensaje) => {
      console.log(mensaje);
    })
    .catch(error => console.log('Error en la promesa:', error));

    console.log('Fin del init');
  }

  getUsuarios() {
    // fetch('https://reqres.in/api/users').then(resp => {
    //     resp.json().then(body => console.log(body)
    // )});
    return new Promise((resolve, reject) => {
      fetch('https://reqres.in/api/users')
        .then(resp => resp.json())
        .then(body => resolve(body.data))
        .catch(() => reject('Algo salio mal'));
    });

  }

}
