import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DataService } from 'src/app/services/data.service';
import { Trail } from '../../model/trail';
import { Task } from '../model/task';

@Component({
  selector: 'app-trail-task',
  templateUrl: './trail-task.component.html',
  styleUrls: ['./trail-task.component.scss']
})
export class TrailTaskComponent implements OnInit {

  taskId: any;
  projectId: any;
  trailTaskList: Trail[] = [];

  constructor(private dataService: DataService, private activated: ActivatedRoute, private router: Router,) {
    this.taskId = this.activated.snapshot.paramMap.get('id');
  }

  ngOnInit(): void {
    this.getTrailTasksList()
    this.getTaskDetails()
  }

  getTrailTasksList() {
    //@ts-ignore
    this.dataService.getCollection(new Trail(), '/task/' + this.taskId)
      .pipe()
      .subscribe((result) => {
        if (result) {
          this.trailTaskList = result
          for (let i = 0; i < result.length; i++) {
            this.trailTaskList[i].attributes = JSON.parse(this.trailTaskList[i].attributes)
            this.trailTaskList[i].newValues = JSON.parse(this.trailTaskList[i].newValues)
            this.trailTaskList[i].oldValues = JSON.parse(this.trailTaskList[i].oldValues)
          }
        }
      })
  }

  getTaskDetails() {
    // @ts-ignore
    const task = new Task();
    task.setId(this.taskId);
    //@ts-ignore
    this.dataService.getItem(task, '/getOne')
      .pipe()
      .subscribe((res) => {
        this.projectId = res.phase.projectId;
      })
  }
}
