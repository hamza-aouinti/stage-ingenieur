import { Component, Inject, OnInit, Optional } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Role } from '../model/role';
import { RoleService } from '../service/role.service';
import Swal from 'sweetalert2'
import { DataService } from '../../../services/data.service';
import { BadInput } from 'src/app/common/errors/bad-input';

@Component({
  selector: 'app-edit-role',
  templateUrl: './edit-role.component.html',
  styleUrls: ['./edit-role.component.scss']
})
export class EditRoleComponent implements OnInit {

  roleForm: FormGroup = Object.create(null);;
  permissions: any = [];
  selectedValue: string[] = []

  constructor(
    public dialogRef: MatDialogRef<EditRoleComponent>,
    private formBuilder: FormBuilder,
    private roleService: RoleService,
    private dataService: DataService,

    // @Optional() is used to prevent error if no data is passed
    @Optional() @Inject(MAT_DIALOG_DATA) public data: Role) {
  }

  ngOnInit(): void {
    this.roleForm = this.formBuilder.group(
      {
        name: [null, [Validators.required, Validators.minLength(3)]],
        description: [null],
        permissions: null,
      });

    this.getRolesList();

    if (this.data) {
      this.roleForm.controls['name'].setValue(this.data.name)
      this.roleForm.controls['description'].setValue(this.data.description)
      this.data.permissions.forEach((element: any) => {
        this.selectedValue.push(element.id)
      });
      this.roleForm.controls['permissions'].setValue(this.selectedValue)
    }
  }

  getRolesList() {
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
      // @ts-ignore
      const roleModel = new Role();
      roleModel.setId(this.data.id);
      // @ts-ignore
      this.dataService.putItem(roleModel, '/edit', this.roleForm.value)
        .pipe()
        .subscribe({
          next: (res: any) => {
            this.closeDialog()

            Toast.fire({
              icon: 'success',
              title: 'Role Modifié avec Succès.',
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
    }
  }

  closeDialog(): void {
    this.dialogRef.close({ event: 'Cancel' });
  }
}
