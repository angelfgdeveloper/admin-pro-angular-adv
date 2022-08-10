import { Component } from '@angular/core';

@Component({
  selector: 'app-grafica1',
  templateUrl: './grafica1.component.html',
  styles: [
  ]
})
export class Grafica1Component {

  labels: string[] = [
    'Label 1',
    'Label 2',
    'Label 3'
  ];

  labels1: string[] = [
    'Download Sales',
    'In-Store Sales',
    'Mail-Order Sales'
  ];

  datasets = [
    {
      data: [
        Math.round(Math.random() * 100),
        Math.round(Math.random() * 100),
        Math.round(Math.random() * 100),
      ],
      backgroundColor: ['#6857E6','#009FEE','#F02059'],
      hoverBackgroundColor: ['#6857E6','#009FEE','#F02059'],
      hoverBorderColor: ['#6857E6','#009FEE','#F02059']
    },
  ];

  datasets1 = [
    {
      data: [
        Math.round(Math.random() * 100),
        Math.round(Math.random() * 100),
        Math.round(Math.random() * 100),
      ],
      backgroundColor: ['#6857E6','#009FEE','#F02059'],
      hoverBackgroundColor: ['#6857E6','#009FEE','#F02059'],
      hoverBorderColor: ['#6857E6','#009FEE','#F02059']
    },
  ];

}
