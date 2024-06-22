import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/core/user/model/user';
import { Project } from 'src/app/project/project/model/project';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-cards-general-statistics',
  templateUrl: './cards-general-statistics.component.html',
  styleUrls: ['./cards-general-statistics.component.scss']
})
export class CardsGeneralStatisticsComponent implements OnInit {
  card1: string = 'Employés'
  card2: string = 'Projets En Cours'
  card3: string = 'Projets Dept. Software'
  card4: string = 'Projets Dept. Hardware'
  employees: number = 0
  softwareProjects: number = 0
  hardwareProjects: number = 0
  inProgressProjects: number = 0

  constructor(public dataService: DataService) {
  }

  ngOnInit(): void {
    this.getData()
  }

  getData() {
    // @ts-ignore
    this.dataService.getCollection(new Project(), '/statistics')
      .pipe()
      .subscribe(
        (response) => {
          // @ts-ignore 
          if (response) {
            this.inProgressProjects = response.inProgressProjects
            this.softwareProjects = response.softwareProjects
            this.hardwareProjects = response.hardwareProjects
          }
        });

    // @ts-ignore
    this.dataService.getCollection(new User(), '/countUsers')
      .pipe()
      .subscribe(
        (response) => {
          // @ts-ignore 
          if (response) {
            this.employees = response.countUsers
          }
        });
  }
}
