import { Component, Input, OnInit } from '@angular/core';
import { Phase } from '../model/phase';
import { AddPhaseComponent } from '../add-phase/add-phase.component';
import { EditPhaseComponent } from '../edit-phase/edit-phase.component';
import { DeletePhaseComponent } from '../delete-phase/delete-phase.component';
import { MatDialog } from '@angular/material/dialog';
import { DataService } from 'src/app/services/data.service';
import { AddUserProjectComponent } from '../../project/add-user-project/add-user-project.component';
import { User } from 'src/app/core/user/model/user';
import { completedStatus, inProgressStatus, newStatus } from 'src/app/utils/variables';

@Component({
  selector: 'app-list-phase',
  templateUrl: './list-phase.component.html',
  styleUrls: ['./list-phase.component.scss']
})
export class ListPhaseComponent implements OnInit {


  @Input() projectId: any;
  sidePanelOpened = true;
  panelOpenState = false;

  phaseList: Phase[] = [];
  selectedPhase: Phase = Object.create(null);
  searchText = '';
  usersList: User[] = [];
  projectName: string = ''
  projectStatus: string = ''

  constructor(public dataService: DataService, public dialog: MatDialog) {
  }

  isOver(): boolean {
    return window.matchMedia(`(max-width: 960px)`).matches;
  }

  ngOnInit(): void {
    this.getPhasesList()
  }

  onSelect(phase: Phase): void {
    this.selectedPhase = phase;
  }

  getSelectedPhase(): Phase {
    return this.selectedPhase;
  }
  getPhasesList() {
    this.phaseList = []
    // @ts-ignore
    this.dataService.getCollection(new Phase(), '/' + this.projectId)
      .pipe()
      .subscribe(
        (response) => {
          // @ts-ignore
          if (response) {
            // @ts-ignore
            response.forEach(phase => {
              this.phaseList.push(phase)
              this.usersList = phase.project.users;
              this.projectName = phase.project.name;
              this.projectStatus = phase.project.status;
              if (phase.title === 'Liste des taches') {
                this.selectedPhase = phase;
              } 
              else {
                switch (phase.status) {
                  case newStatus: {
                    return phase.color = 'success';
                    break;
                  }
                  case inProgressStatus: {
                    return phase.color = 'warning';
                    break;
                  }
                  case completedStatus: {
                    return phase.color = 'megna';
                    break;
                  }
                }
              }
            })
          }
        })
  }

  openAddDialog(projectId: string) {
    const dialogRef = this.dialog.open(AddPhaseComponent, {
      width: '50%',
      data: projectId
    });
    dialogRef.afterClosed().subscribe(result => {
      this.getPhasesList()
    });
  }

  openEditDialog(row: any) {
    const dialogRef = this.dialog.open(EditPhaseComponent, {
      width: '50%',
      data: row
    });
    dialogRef.afterClosed().subscribe(result => {
      this.getPhasesList()
    });
  }

  openDeleteDialog(obj: any) {
    const dialogRef = this.dialog.open(DeletePhaseComponent, {
      data: obj
    });
    dialogRef.afterClosed().subscribe(result => {
      this.getPhasesList();
    })
  }

  openAddUserProjectDialog(projectId: string) {
    const dialogRef = this.dialog.open(AddUserProjectComponent, {
      height: '40%',
      width: '30%',
      data: projectId
    });
    dialogRef.afterClosed().subscribe(result => {
        this.getPhasesList()
    });
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
        return 'course-header';
    }
  }

}
