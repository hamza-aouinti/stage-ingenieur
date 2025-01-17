import { Component, Inject, OnInit, Optional } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { User } from 'src/app/core/user/model/user';
import { DataService } from 'src/app/services/data.service';
import Swal from 'sweetalert2';
import { Project } from '../model/project';
import { MAT_DATE_FORMATS, DateAdapter, MAT_DATE_LOCALE } from '@angular/material/core';
import { CustomDateAdapter, MY_DATE_FORMATS } from '../../utils/format-date';
import { completedStatus, inProgressStatus, newStatus, types } from 'src/app/utils/variables';

@Component({
  selector: 'app-edit-project',
  templateUrl: './edit-project.component.html',
  styleUrls: ['./edit-project.component.scss'],
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: 'en-US' }, // Change the locale if necessary
    { provide: DateAdapter, useClass: CustomDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS },
  ],
})
export class EditProjectComponent implements OnInit {

  projectForm: FormGroup = Object.create(null);
  types: string[] = types
  usersList: User[] = [];
  status: string[] = [];
  currentStatus: string = '';
  selectedValue: string[]=[]

  constructor(
    public dialogRef: MatDialogRef<EditProjectComponent>,
    private formBuilder: FormBuilder, private dataService: DataService,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: Project) {

  }

  ngOnInit(): void {
    this.projectForm = this.formBuilder.group(
      {
        name: [null, [Validators.required, Validators.minLength(3)]],
        description: [null],
        type: [null, Validators.required],
        startDate: [null, Validators.required],
        endDate: [null, Validators.required],
        users: null,
        status: [null, Validators.required],
      });
    this.getUsersList();

    if (this.data) {
      this.currentStatus = this.data.status;
      this.setSatus()
      this.projectForm.controls['name'].setValue(this.data.name)
      this.projectForm.controls['description'].setValue(this.data.description)
      this.projectForm.controls['type'].setValue(this.data.type)
      this.projectForm.controls['startDate'].setValue(this.data.startDate)
      this.projectForm.controls['endDate'].setValue(this.data.endDate)
      this.projectForm.controls['status'].setValue(this.data.status)      
      this.data.users.forEach((element:any) => {
        this.selectedValue.push(element.id)
      });
      this.projectForm.controls['users'].setValue(this.selectedValue)

    }
  }

  getUsersList() {
    // @ts-ignore
    this.dataService.getCollection(new User(), null)
      .pipe()
      .subscribe(
        (response: { usersList: any; }) => {
          // @ts-ignore
          if (response) {
            // @ts-ignore
            this.usersList = response;
          }
        });
  }

  setSatus() {
    switch (this.currentStatus) {
      case newStatus: {
        this.status = [newStatus, inProgressStatus];
        break;
      }
      case inProgressStatus: {
        this.status = [inProgressStatus, completedStatus];
        break;
      }
      case completedStatus: {
        this.status = [completedStatus];
        break;
      }
    }
  }

  submit() {
    if (this.projectForm.valid) {
      // @ts-ignore
      const projectModel = new Project();
      projectModel.setId(this.data.id);
      let project = {
        name: this.projectForm.value.name,
        description: this.projectForm.value.description,
        type: this.projectForm.value.type,
        startDate:  this.projectForm.value.startDate,
        endDate:  this.projectForm.value.endDate,
        users: this.projectForm.value.users,
        status: this.projectForm.value.status,
      };
      // @ts-ignore
      this.dataService.putItem(projectModel, '/edit', project)
        .pipe()
        .subscribe({
          next: (res: any) => {
            this.closeDialog()
            const Toast = Swal.mixin({
              toast: true,
              position: 'top-end',
              showConfirmButton: false,
              timer: 3000,
              timerProgressBar: true,
              didOpen: (toast) => {
                toast.addEventListener('mouseenter', Swal.stopTimer)
                toast.addEventListener('mouseleave', Swal.resumeTimer)
              }
            })

            Toast.fire({
              icon: 'success',
              title: 'Projet Modifié avec Succès.'
            })
          }
        })
    }
  }

  closeDialog(): void {
    this.dialogRef.close({ event: 'Cancel' });
  }
}
