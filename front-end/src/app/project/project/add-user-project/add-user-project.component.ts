import { Component, EventEmitter, Inject, OnInit, Optional, Output } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { User } from 'src/app/core/user/model/user';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DataService } from 'src/app/services/data.service';
import { Project } from '../model/project';
import { ProjectService } from '../service/project.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-add-user-project',
  templateUrl: './add-user-project.component.html',
  styleUrls: ['./add-user-project.component.scss']
})
export class AddUserProjectComponent implements OnInit {

  users = new FormControl('');
  filteredUsers: Observable<User[]>;

  usersList: User[] = [];
  usersProject: User[] = [];
  usersToAdd: User[] = [];
  search: string[] = []
  user: number = 0
  constructor(
    private dataService: DataService,
    public dialogRef: MatDialogRef<AddUserProjectComponent>,
    private projectService: ProjectService,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any

  ) {
    this.getUsers()

    this.filteredUsers = this.users.valueChanges.pipe(
      startWith(''),
      map(user => (user ? this._filterUsers(user) : this.usersToAdd.slice())),
    );
  }
  ngOnInit(): void {
  }

  getUsers() {
    // @ts-ignore
    const project = new Project();
    project.setId(this.data);
    //@ts-ignore
    this.dataService.getItem(project, '/getOne')
      .pipe()
      .subscribe((res) => {
        this.usersProject = res.users
        // @ts-ignore
        this.dataService.getCollection(new User(), null)
          .pipe()
          .subscribe(
            (response) => {
              // @ts-ignore
              if (response) {
                // @ts-ignore
                this.usersList = response;
                this.usersToAdd = this.usersList.filter((user) => {
                  //The some() method is used to check whether the id of each user in usersList matches the id of any user in usersProject
                  return !this.usersProject.some((projUser) => projUser.id === user.id);
                });
              }
            });

      })


  }

  private _filterUsers(value: string): User[] {
    const filterValue = value.toLowerCase();

    return this.usersToAdd.filter(user => user.firstName.toLowerCase().includes(filterValue) || user.lastName.toLowerCase().includes(filterValue));
  }

  submit() {
    this.search = this.users.value
    this.projectService.getUserId(this.search).pipe().subscribe((data) => {
      this.user = data.id

      // @ts-ignore
      const projectModel = new Project();
      projectModel.setId(this.data);
      let project = {
        user: this.user
      };
      // @ts-ignore
      this.dataService.putItem(projectModel, '/affectUsersProject', project)
        .pipe()
        .subscribe({
          next: (res: any) => {
            this.closeDialog()
            const Toast = Swal.mixin({
              toast: true,
              width:390,
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
              title: 'Utilisateur Ajouté avec Succès.'
            })
          }
        })
    })
  }

  closeDialog(): void {
    this.dialogRef.close({ event: 'Cancel' });
  }


}
