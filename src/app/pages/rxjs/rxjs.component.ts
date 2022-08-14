import { Component, OnDestroy } from '@angular/core';
import { Observable, interval, Subscription } from 'rxjs';
import { map, retry, take, filter } from 'rxjs/operators';

@Component({
  selector: 'app-rxjs',
  templateUrl: './rxjs.component.html',
  styles: [
  ]
})
export class RxjsComponent implements OnDestroy {

  public intervalSubs!: Subscription;

  constructor() {

    // # 1.1
    // this.retornaObservable().pipe(
    //   // retry -> Vuelve a intentar otra vez
    //   retry(2)
    // ).subscribe({
    //     next: valor => console.log('Subs:', valor),
    //     error: error => console.warn(error),
    //     complete: () => console.log('Obs terminado')
    // });

    // # 2.2
    this.intervalSubs = this.retornaItervalo().subscribe({
      next: console.log,
    })

  }

  ngOnDestroy(): void {
    this.intervalSubs.unsubscribe(); // termina el observable
  }

  // # 2.0
  retornaItervalo(): Observable<number> {
    // 1000 = 1segundo
    const intervalo$ = interval(100).pipe(
      // El take llega hasta el 10, importa el orden de los operators
      take(300), // Cuantas emisiones se necesitan, hasta el 4
      map( valor => {
        // Recibe el 0 y le suma el 1, empezando con 1 y no con 0
        // Se puede modificar el valor, para regresar lo que necesitamos
        return valor + 1; // 0 => 1
      }),
      filter(valor => (valor % 2 === 0) ? true : false), // Filtrar datos por true o false
    );

    return intervalo$;
  }

  // # 1.0
  retornaObservable(): Observable<number> {
    let i = -1;

    const obs$ = new Observable<number>(observer => {
      // let i = -1;

      const intervalo = setInterval(() => {
        // console.log('tick');
        i++;
        observer.next(i);

        if (i === 4) {
          clearInterval(intervalo);
          observer.complete();
        }

        if (i === 2) {
          // console.log('i = 2... error');
          // i = 0;
          observer.error('i llego al valor de 2');
        }

      }, 1000);

    });

    return obs$;

    // Antes
    // obs$.subscribe(
    //   valor => console.log('Subs:', valor),
    //   error => console.warn(error),
    //   () => console.info('Obs terminado')
    // );

    // Nueva forma
    // obs$.pipe(
    //   // retry -> Vuelve a intentar otra vez
    //   retry(2)
    // ).subscribe({
    //     next: valor => console.log('Subs:', valor),
    //     error: error => console.warn(error),
    //     complete: () => console.log('Obs terminado')
    // });

  }

}
