import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Project } from 'src/app/project/project/model/project';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-home-dashboard',
  templateUrl: './home-dashboard.component.html',
  styleUrls: ['./home-dashboard.component.scss']
})
export class HomeDashboardComponent implements OnInit {

  label: string = 'Choisir Projet'
  projectList: Project[] = []
  selectedValue = new FormControl();
  projectId: any
  noResult : string ='Aucun résultat trouvé'

  constructor(private dataService: DataService) { }

  ngOnInit(): void {
    this.getListProject()
  }
  getListProject() {
    // @ts-ignore
    this.dataService.getCollection(new Project(), null)
      .pipe()
      .subscribe(
        (response: any) => {
          // @ts-ignore
          if (response) {
            this.projectList = response
          }
        });
  }
  changeProject(value: any) {
    this.projectId = value
  }
}
