import { Component, Input, OnInit } from '@angular/core';
import { ChartData, ChartDataset } from 'chart.js';

@Component({
  selector: 'app-dona',
  templateUrl: './dona.component.html',
  styles: [
  ]
})
export class DonaComponent implements OnInit {

  @Input() title: string = 'Sin título';
  @Input() labels: string[] = ['Sin título', 'Sin título', 'Sin título'];
  @Input() datasets: ChartDataset<'doughnut'>[] = [];

  public doughnutChartData!: ChartData<'doughnut'>;

  ngOnInit(): void {
    this.doughnutChartData = { labels: this.labels, datasets: this.datasets };
  }

}
