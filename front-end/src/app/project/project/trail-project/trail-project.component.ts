import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DataService } from 'src/app/services/data.service';
import { Project } from '../model/project';
import { Trail } from '../../model/trail';

@Component({
  selector: 'app-trail-project',
  templateUrl: './trail-project.component.html',
  styleUrls: ['./trail-project.component.scss']
})
export class TrailProjectComponent implements OnInit {
  projectId: any;
  trailProjectList: Trail[] = [];
  projectName: string = ""
  userName: string = ""
  usersList: string[] = []

  constructor(private dataService: DataService, private activated: ActivatedRoute, private router: Router,) {
    this.projectId = this.activated.snapshot.paramMap.get('id');
  }

  ngOnInit(): void {
    this.getProjectDetails()
    this.getTrailProjectsList()
  }

  getTrailProjectsList() {
    let index = 0
    //@ts-ignore
    this.dataService.getCollection(new Trail(), '/project/' + this.projectId)
      .pipe()
      .subscribe((result) => {
        if (result) {
          this.trailProjectList = result
          this.trailProjectList.forEach((element: any) => {
            element.attributes = JSON.parse(element.attributes)
            index = element.attributes.indexOf('users')
            element.newValues = JSON.parse(element.newValues)
            element.oldValues = JSON.parse(element.oldValues)
            if(index!= -1){
            const newVals = element.newValues[index]
            element.newValues[index] = element.newValues[index].filter((name:any) => !element.oldValues[index].includes(name));
            element.oldValues[index] = element.oldValues[index].filter((name:any) => !newVals.includes(name));
          }
          });
        }

      })
  }

  getProjectDetails() {
    // @ts-ignore
    const project = new Project();
    project.setId(this.projectId);
    //@ts-ignore
    this.dataService.getItem(project, '/getOne')
      .pipe()
      .subscribe((res) => {
        this.projectName = res.name;
      })
  }
}
