import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { RoleService } from '../service/role.service';
import Swal from 'sweetalert2'
import { DataService } from '../../../services/data.service';
import { Role } from '../model/role';
import { BadInput } from 'src/app/common/errors/bad-input';
 
@Component({
  selector: 'app-add-role',
  templateUrl: './add-role.component.html',
  styleUrls: ['./add-role.component.scss']
})
export class AddRoleComponent implements OnInit {

  roleForm: FormGroup = Object.create(null);;
  permissions: any = [];

  constructor(
    private dataService: DataService,
    public dialogRef: MatDialogRef<AddRoleComponent>,
    private formBuilder: FormBuilder,
    private roleService: RoleService,) {

  }

  ngOnInit(): void {
    this.roleForm = this.formBuilder.group(
      {
        name: [null, [Validators.required, Validators.minLength(3)]],
        description: [null],
        permissions: null,
      });
    this.getPermissionsList();
  }

  getPermissionsList(){
    this.roleService.getPermissionss().subscribe((data) => {
      this.permissions = data
    })
  }

  Submit() {
    const Toast = Swal.mixin({
      toast: true,
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
      didOpen: (toast) => {
        toast.addEventListener('mouseenter', Swal.stopTimer)
        toast.addEventListener('mouseleave', Swal.resumeTimer)
      }
    })
    if (this.roleForm.valid) {
      let role = {
        name: this.roleForm.value.name,
        description: this.roleForm.value.description,
        permissions: this.roleForm.value.permissions,
      };
      // @ts-ignore
      this.dataService.postItem(new Role(), '/add', role)
        .pipe()
        .subscribe({
          next: () => {
            this.closeDialog();
            
            Toast.fire({
              icon: 'success',
              title: 'Role Ajouté Avec Succès.',
              position: 'top-end',
              width: 400,
            })
          }, 
          error: () => {
            Toast.fire({
              icon: 'error',
              text: BadInput.message,
              position: 'bottom',
              width: 450,
            })           
          }
        })
    } else {
      // @ts-ignore
      Functions.validateOnSubmit(this.UserForm);
    }
  }

  closeDialog(): void {
    this.dialogRef.close({ event: 'Cancel' });
  }
}
