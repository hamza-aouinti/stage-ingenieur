import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/app/services/data.service';
import { completedStatus, inProgressStatus, newStatus } from 'src/app/utils/variables';
import { Project } from 'src/app/project/project/model/project';

@Component({
  selector: 'app-tracker-list-projects',
  templateUrl: './tracker-list-projects.component.html',
  styleUrls: ['./tracker-list-projects.component.scss']
})
export class TrackerListProjectsComponent implements OnInit {
  projects: any = [];
  view: any[] = [760, 335];
  // options
  showXAxis: boolean = true;
  showYAxis: boolean = true;
  gradient: boolean = false;
  showLegend: boolean = true;
  showXAxisLabel: boolean = true;
  yAxisLabel: string = 'Projets';
  showYAxisLabel: boolean = true;
  xAxisLabel: string = 'Nombre';
  legendTitle: string = 'Légende';
  position: string = 'below'

  colorScheme = {
    domain: ['#26c6da', '#ffb22b', '#009688']
  };
  projectsNumber: number = 0
  title: string = 'Projets'
  legend: string = 'Classement selon type des projets'
  constructor( private dataService: DataService,) {
    Object.assign(this, this.projects);
  }

  ngOnInit(): void {
    this.getData()
  }

  getData() {
    // @ts-ignore
    this.dataService.getCollection(new Project(), '/statisticsByType')
      .pipe()
      .subscribe(
        (response) => {
          // @ts-ignore 
          if (response) {
            this.projects = this.orderProjectsByStatus(response);
          }
        });
  }

  orderProjectsByStatus(projects: any[]): any[] {
    const statusOrder = [newStatus, inProgressStatus, completedStatus];
    return projects.map((project: any) => {
      const orderedSeries = statusOrder.map((status) => {
        const seriesItem = project.series.find((item: any) => item.name === status);
        return seriesItem ? seriesItem : { name: status, value: 0 };
      });
      return { ...project, series: orderedSeries };
    });
  }
}






