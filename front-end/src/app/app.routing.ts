import { Routes } from '@angular/router';

import { FullComponent } from './layouts/full/full.component';
import { LoginComponent } from './authentication/login/login.component';
import { AuthGuard } from './guards/auth.guard';
import { Page404Component } from './page404/page404.component';
import { HomeDashboardComponent } from './dashboard/home-dashboard/home-dashboard.component';

export const AppRoutes: Routes = [
  {
    path: '',
    redirectTo: '/login',
    pathMatch: 'full',
  },
  {
    path: '',
    component: FullComponent,
    // canActivate:[AuthGuard],

    children: [
      {
        path: 'dashboard',
        component: HomeDashboardComponent,
        canActivate:[AuthGuard],
      },
      {
        path: 'user',
        loadChildren: () =>
          import('./core/core.module').then((m) => m.CoreModule),
      },
      {
        path: 'project',
        loadChildren: () =>
          import('./project/project.module').then((m) => m.ProjectModule),
      },
      {
        path: 'material',
        loadChildren: () =>
          import('./material-component/material.module').then(
            (m) => m.MaterialComponentsModule
          ),
      },
    ],
  },
  {
    path: '**',
    component: Page404Component
  }
];
