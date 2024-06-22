import { Component, OnInit } from '@angular/core';
import { Project } from '../model/project';
import { MatDialog } from '@angular/material/dialog';
import { AuthenticationService } from 'src/app/authentication/authentication.service';
import { DataService } from 'src/app/services/data.service';
import { AddProjectComponent } from '../add-project/add-project.component';
import { EditProjectComponent } from '../edit-project/edit-project.component';
import { DeleteProjectComponent } from '../delete-project/delete-project.component';
import { MatSelectChange } from '@angular/material/select';
import { ProjectService } from '../service/project.service';
import { Legend, legendStatus } from '../../utils/legend';
import { applicatioWeb, applicationMobile, completedStatus, electronicSystem, embeddedSystem, inProgressStatus, newStatus } from 'src/app/utils/variables';

@Component({
  selector: 'app-list-project',
  templateUrl: './list-project.component.html',
  styleUrls: ['./list-project.component.scss']
})
export class ListProjectComponent implements OnInit {

  projectList: Project[] = [];
  originalProjectList: Project[] = [];
  selectedType = 'All';
  selectedStatus = 'All';
  startDate: Date | null = null;
  endDate: Date | null = null;
  startDateChanged: string | null = ""
  endDateChanged: string | null = ""
  errorMessage: string | null = null;
  panelOpenState: boolean = false;
  legend: string = "Légende"
  legends: Legend[] = legendStatus;
  newStatus = newStatus
  inProgressStatus = inProgressStatus
  completedStatus = completedStatus
  applicatioWeb = applicatioWeb
  applicationMobile = applicationMobile
  embeddedSystems = embeddedSystem
  electronicSystems = electronicSystem

  constructor(private dataService: DataService, private authServ: AuthenticationService, public dialog: MatDialog, private projectService: ProjectService) {
  }

  ngOnInit(): void {
    this.getProjectsList();
  }

  getProjectsList() {
    if (this.authServ.getUser().role.name === 'admin') {
      // @ts-ignore
      this.dataService.getCollection(new Project(), null)
        .pipe()
        .subscribe(
          (response) => {
            // @ts-ignore
            console.log(response)
            if (response) {
              this.projectList = response
              this.originalProjectList = [...this.projectList];
            }
          });
    }
    else {
      // @ts-ignore
      this.dataService.getCollection(new Project(), '/' + this.authServ.getUser().id)
        .pipe()
        .subscribe(
          (response) => {
            // @ts-ignore
            console.log(response)
            if (response) {
              response.forEach((project: any) => {
                this.projectList.push(project.project)
              });
            }
          });
    }
  }

  openAddDialog() {
    const dialogRef = this.dialog.open(AddProjectComponent, {
      width: '50%',
    });
    dialogRef.afterClosed().subscribe(result => {
      this.getProjectsList()
    });
  }

  openEditDialog(row: any) {
    const dialogRef = this.dialog.open(EditProjectComponent, {
      data: row,
      width: '50%',
    });
    dialogRef.afterClosed().subscribe(result => {
      this.getProjectsList()
    });
  }

  openDeleteDialog(obj: any) {
    const dialogRef = this.dialog.open(DeleteProjectComponent, {
      data: obj
    });
    dialogRef.afterClosed().subscribe(result => {
      this.getProjectsList();
    })
  }

  searchProjects() {
    const params = {
      type: this.selectedType,
      status: this.selectedStatus,
      startDate: this.startDate ? this.startDateChanged : null,
      endDate: this.endDate ? this.endDateChanged : null
    };
    this.projectService.searchProjects(params).subscribe((data) => {
      this.projectList = data
    })
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;

    if (filterValue)
      this.projectList = this.filterProject(filterValue);
    else
      this.projectList = [...this.originalProjectList];
  }

  filterProject(v: string): Project[] {
    return this.projectList.filter(x => x.name.toLowerCase().indexOf(v.toLowerCase()) !== -1 || x.type.toLowerCase().indexOf(v.toLowerCase()) !== -1 || x.status.toLowerCase().indexOf(v.toLowerCase()) !== -1 || x.startDate.toString().indexOf(v.toString()) !== -1);
  }

  applyNameFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;

    if (filterValue)
      this.projectList = this.filterByName(filterValue);
    else
      this.projectList = [...this.originalProjectList];
  }

  filterByName(v: string): Project[] {
    return this.projectList.filter(x => x.name.toLowerCase().indexOf(v.toLowerCase()) !== -1);
  }

  applyTypeFilter(event: MatSelectChange) {
    this.selectedType = event.value;
    this.searchProjects();
  }

  applyStatusFilter(event: MatSelectChange) {
    this.selectedStatus = event.value;
    this.searchProjects();
  }

  applyDateFilter(): void {
    if (this.startDate) {
      this.startDateChanged = this.startDate.toISOString();
    }
    else {
      this.startDateChanged = null;
    }
    if (this.endDate) {
      this.endDateChanged = this.endDate.toISOString();
    }
    else {
      this.endDateChanged = null;
    }
    this.searchProjects()
  }

  validateDateInput(event: any): void {
    const input = event.target.value;
    const regex = /^\d{0,2}\/\d{0,2}\/\d{0,4}$/;
    if (!regex.test(input)) {
      this.errorMessage = 'Invalid date format. Please use the format dd/mm/yyyy.';
      event.target.value = '';
    } else {
      this.startDate = input;
      this.errorMessage = null;
    }
  }

  togglePanel() {
    this.panelOpenState = !this.panelOpenState
  }

  hasPermission(path: any): boolean {
    const user = this.authServ.getUser()
    const permissions = user.role.permissions.map((permission: any) => permission.path)
    if (permissions.includes('/project/' + path))
      return true
    else return false
  }

  getStatusClass(status: string): string {
    switch (status) {
      case newStatus:
        return 'course-header new';
      case inProgressStatus:
        return 'course-header in-progress';
      case completedStatus:
        return 'course-header completed';
      default:
        return 'course-header';
    }
  }
}
