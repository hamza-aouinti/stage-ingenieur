import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CoreRoutingModule } from './core-routing.module';
import { ListRoleComponent } from './role/list-role/list-role.component';
import { AddRoleComponent } from './role/add-role/add-role.component';
import { EditRoleComponent } from './role/edit-role/edit-role.component';
import { DeleteRoleComponent } from './role/delete-role/delete-role.component';

import { FlexLayoutModule } from '@angular/flex-layout';
import { DemoMaterialModule } from '../demo-material-module';
import { MatDialogModule } from '@angular/material/dialog';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { NgxPaginationModule } from 'ngx-pagination';
import { ListUserComponent } from './user/list-user/list-user.component';
import { AddUserComponent } from './user/add-user/add-user.component';
import { EditUserComponent } from './user/edit-user/edit-user.component';
import { DeleteUserComponent } from './user/delete-user/delete-user.component';
import { ImportUserComponent } from './user/import-user/import-user.component';
import { ProfileUserComponent } from './user/profile-user/profile-user.component';
import { FileUploadModule } from 'ng2-file-upload';
@NgModule({
  declarations: [
    ListRoleComponent,
    AddRoleComponent,
    EditRoleComponent,
    DeleteRoleComponent,
    ListUserComponent,
    AddUserComponent,
    EditUserComponent,
    DeleteUserComponent,
    ImportUserComponent,
    ProfileUserComponent],
  imports: [
    CommonModule,
    CoreRoutingModule,
    FlexLayoutModule,
    DemoMaterialModule,
    MatDialogModule,
    ReactiveFormsModule,
    FormsModule,
    PerfectScrollbarModule,
    Ng2SearchPipeModule,
    NgxPaginationModule,
    FileUploadModule
  ]
})
export class CoreModule { }
