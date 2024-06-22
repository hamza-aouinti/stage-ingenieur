import { Component, OnInit } from '@angular/core';
import { Task } from '../../task/model/task';
import { MatDialog } from '@angular/material/dialog';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { AddTaskComponent } from '../../task/add-task/add-task.component';
import { DeleteTaskComponent } from '../../task/delete-task/delete-task.component';
import { DataService } from 'src/app/services/data.service';
import { ActivatedRoute } from '@angular/router';
import { Phase } from '../model/phase';
import { completedStatus, inProgressStatus, integratedStatus, newStatus, resolvedStatus } from 'src/app/utils/variables';

@Component({
  selector: 'app-board-phase',
  templateUrl: './board-phase.component.html',
  styleUrls: ['./board-phase.component.scss']
})
export class BoardPhaseComponent implements OnInit {
  newStatus = "To Do";
  inProgressStatus = inProgressStatus;
  integratedStatus = integratedStatus;
  resolvedStatus = resolvedStatus;
  completedStatus = completedStatus;

  newList: Task[] = [];
  inprogresList: Task[] = [];
  resolvedList: Task[] = [];
  integratedList: Task[] = [];
  doneList: Task[] = [];

  phaseId: any
  projectName: string | null = '';
  projectStatus: string = '';
  projectId: string = ''
  phaseTitle: string | null = '';

  constructor(public dialog: MatDialog, private activated: ActivatedRoute, private dataService: DataService,) {
    this.phaseId = this.activated.snapshot.paramMap.get('id');
  }

  ngOnInit(): void {
    this.getDetails()
    this.getTasks()
  }

  getTasks() {
    this.newList = [];
    this.inprogresList = [];
    this.resolvedList = [];
    this.integratedList = [];
    this.doneList = [];
    //@ts-ignore
    this.dataService.getCollection(new Task(), '/' + this.phaseId)
      .pipe()
      .subscribe((result) => {
        if (result) {
          //@ts-ignore
          result.forEach((task => {
            switch (task.status) {
              case newStatus: {
                this.newList.push(task);
                break;
              }
              case inProgressStatus: {
                this.inprogresList.push(task);
                break;
              }
              case resolvedStatus: {
                this.resolvedList.push(task);
                break;
              }
              case integratedStatus: {
                this.integratedList.push(task);
                break;
              }
              case completedStatus: {
                this.doneList.push(task);
                break;
              }
            }
          }));

          /*   this.newList = [...this.newList];
             this.inprogresList = [...this.inprogresList];
             this.resolvedList = [...this.resolvedList];
             this.integratedList = [...this.integratedList];
             this.doneList = [...this.doneList];*/
        }

      });
  }

  getDetails() {
    // @ts-ignore
    const phase = new Phase();
    phase.setId(this.phaseId);
    //@ts-ignore
    this.dataService.getItem(phase, '/getOne')
      .pipe()
      .subscribe((res) => {
        console.log(res);
        this.phaseTitle = res.title
        this.projectName = res.project.name
        this.projectStatus = res.status
        this.projectId = res.project.id
      })
  }

  drop(event: CdkDragDrop<any[]>): void {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      switch (event.previousContainer.id) {
        case 'cdk-drop-list-0': {
          if (event.container.id === 'cdk-drop-list-1')
            this.transferItem(event)
          break;
        }
        case 'cdk-drop-list-1': {
          if (event.container.id === 'cdk-drop-list-2')
            this.transferItem(event)
          break;
        }
        case 'cdk-drop-list-2': {
          if (event.container.id === 'cdk-drop-list-3')
            this.transferItem(event)
          break;
        }
        case 'cdk-drop-list-3': {
          if (event.container.id === 'cdk-drop-list-4')
            this.transferItem(event)
          break;
        }
      }
    }
  }

  transferItem(event: CdkDragDrop<any[]>): void {
    const droppedElement = event.previousContainer.data[event.previousIndex];
    console.log(event.container)
    transferArrayItem(event.previousContainer.data, event.container.data, event.previousIndex, event.currentIndex);
    // @ts-ignore
    const task = new Task();
    task.setId(droppedElement.id);
    // @ts-ignore
    this.dataService.putItem(task, '/edit', { status: this.setNewStatus(event.container.id), phaseId: this.phaseId })
      .pipe()
      .subscribe()
  }

  setNewStatus(containerId: string) {
    switch (containerId) {
      case 'cdk-drop-list-0': {
        return newStatus;
        break;
      }
      case 'cdk-drop-list-1': {
        return inProgressStatus;
        break;
      }
      case 'cdk-drop-list-2': {
        return resolvedStatus;
        break;
      }
      case 'cdk-drop-list-3': {
        return integratedStatus;
        break;
      }
      case 'cdk-drop-list-4': {
        return completedStatus;
        break;
      }
    }
  }

  openDialog(action: string, obj: any): void {
    obj.action = action;
    const dialogRef = this.dialog.open(AddTaskComponent, {
      data: obj
    });
    dialogRef.afterClosed().subscribe(result => {
    });
  }

  deleteTask(task: any) {
    const dialogRef = this.dialog.open(DeleteTaskComponent, {
      data: task
    });
    dialogRef.afterClosed().subscribe(result => {
      this.getTasks();
    })
  }

  getStatusClass(status: string): string {
    switch (status) {
      case newStatus:
        return 'label label-success';
      case inProgressStatus:
        return 'label label-warning';
      case completedStatus:
        return 'label label-megna';
      default:
        return 'label label-info';
    }
  }
}




