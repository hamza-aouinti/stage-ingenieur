import { Component, OnInit } from '@angular/core';
import { Project } from 'src/app/project/project/model/project';
import { DataService } from 'src/app/services/data.service';
import { completedStatus, inProgressStatus, newStatus } from 'src/app/utils/variables';

@Component({
  selector: 'app-status-list-projects',
  templateUrl: './status-list-projects.component.html',
  styleUrls: ['./status-list-projects.component.scss']
})
export class StatusListProjectsComponent implements OnInit {
  title: string ="Projets"
  legend: string ="Classement selon le status "
  result: any[]=[];
  view: any[] = [390, 334];

  // options
  showLegend: boolean = true;
  showLabels: boolean = true;
  isDoughnut: boolean = false;
  legendPosition: string = 'below';
  legendTitle: string = 'Légende';

  colorScheme = {
    domain: ['#26c6da', '#ffb22b', '#009688']
  };

  constructor(public dataService : DataService) { 
    Object.assign(this, this.result);
   }

  ngOnInit(): void {
    this.getData()
  }

  getData() {
    // @ts-ignore
    this.dataService.getCollection(new Project(), '/statisticsByStatus')
      .pipe()
      .subscribe(
        (response) => {
          // @ts-ignore 
          if (response) {            
            this.result = response.sort((a:any, b:any) => {
              const statusOrder = [newStatus, inProgressStatus, completedStatus];
              return statusOrder.indexOf(a.name) - statusOrder.indexOf(b.name);
            });          }
        });
  }

}

