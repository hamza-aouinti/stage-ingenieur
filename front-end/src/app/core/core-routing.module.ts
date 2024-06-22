import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ListRoleComponent } from './role/list-role/list-role.component';
import { ListUserComponent } from './user/list-user/list-user.component';
import { AuthGuard } from '../guards/auth.guard';
import { HasPermissionGuard } from '../guards/has-permission.guard';
import { ProfileUserComponent } from './user/profile-user/profile-user.component';

export const routes: Routes = [
  {
    path: 'roles',
    component: ListRoleComponent,
    canActivate: [AuthGuard, HasPermissionGuard],
    data: {
      permission: '/role/',
      title: 'Liste roles',
    },
  },

  {
    path: 'list', component: ListUserComponent,
    canActivate: [AuthGuard, HasPermissionGuard],
    data: {
      permission: '/user/',
      title: 'Liste utilisateurs',
    }
  },
  {
    path: 'profile', component: ProfileUserComponent,
    canActivate: [AuthGuard],
    data: {
      title: 'Profil',
    }
  }


];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CoreRoutingModule { }
