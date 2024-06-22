import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AddProjectComponent } from './project/add-project/add-project.component';
import { DetailsProjectComponent } from './project/details-project/details-project.component';
import { AddTaskComponent } from './task/add-task/add-task.component';
import { EditTaskComponent } from './task/edit-task/edit-task.component';
import { ListTaskComponent } from './task/list-task/list-task.component';
import { ListProjectComponent } from './project/list-project/list-project.component';
import { AuthGuard } from '../guards/auth.guard';
import { HasPermissionGuard } from '../guards/has-permission.guard';
import { BoardPhaseComponent } from './phase/board-phase/board-phase.component';
import { AddChildTaskComponent } from './task/add-child-task/add-child-task.component';
import { TrailTaskComponent } from './task/trail-task/trail-task.component';
import { TrailProjectComponent } from './project/trail-project/trail-project.component';

const routes: Routes = [
  {
    path: 'add', component: AddProjectComponent,
    canActivate: [AuthGuard, HasPermissionGuard],
    data: {
      permission: '/project/add'
    },
  },
  {
    path: 'details/:id', component: DetailsProjectComponent,
    canActivate: [AuthGuard, HasPermissionGuard],
    data: {
      permission: '/project/:id/getOne',
      title: 'Projet détails',
    },
  },
  {
    path: 'list', component: ListProjectComponent,
    canActivate: [AuthGuard],
    data: {
      //permission: '/project/',
      title: 'Liste projets',
    },
  },
  {
    path: 'trail/:id', component: TrailProjectComponent,
    canActivate: [AuthGuard],
    data: {
      title: 'Historique',
    },
  },
  {
    path: 'phase',
    children: [
      {
        path: 'board/:id', component: BoardPhaseComponent,
        canActivate: [AuthGuard],
        data: {
          title: 'Tableau des tâches',
        },
      }
    ]
  },
  {
    path: 'task',
    canActivate: [AuthGuard],
    children: [
      {
        path: 'add/:id', component: AddTaskComponent,
      },
      {
        path: 'add-child/:id', component: AddChildTaskComponent,
      },
      {
        path: 'list', component: ListTaskComponent,
      },
      {
        path: 'edit/:id', component: EditTaskComponent,
      },
      {
        path: 'trail/:id', component: TrailTaskComponent,
        data: {
          title: 'Historique',
        },
      },
    ]
  },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProjectRoutingModule { }
