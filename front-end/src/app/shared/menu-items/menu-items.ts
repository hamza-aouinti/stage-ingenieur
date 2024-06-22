import { Injectable } from '@angular/core';

export interface BadgeItem {
  type: string;
  value: string;
}
export interface Saperator {
  name: string;
  type?: string;
}
export interface SubChildren {
  state: string;
  name: string;
  type?: string;
}
export interface ChildrenItems {
  permission?: string;
  state: string;
  name: string;
  type?: string;
  child?: SubChildren[];
}

export interface Menu {
  permission?: string;
  state: string;
  name: string;
  type: string;
  icon: string;
  badge?: BadgeItem[];
  saperator?: Saperator[];
  children?: ChildrenItems[];
}

const MENUITEMS = [
//   {
//     state: 'dashboard',
//     name: 'Dashboard',
//     type: 'link',
//     icon: 'dashboard'
// },
  {
    state: 'user',
    name: 'Gestion utilisateurs',
    type: 'sub',
    icon: 'person',
    children: [
      {
        state: 'list',
        name: 'Liste utilisateurs',
        type: 'link',
        permission: '/user/'
      },
      {
        state: 'roles', name: 'Liste roles', type: 'link', permission: '/role/'
      },
    ],
  },
  {
    state: 'project',
    name: 'Gestion projets',
    type: 'sub',
    icon: 'layers',
    children: [
      {
        state: 'list', name: 'Liste projets', type: 'link', permission: '/project/'
      },
    ],
  },
  /*{
    state: 'user',
    name: 'Profile',
    type: 'link',
    icon: 'perm_contact_calendar',
  },*/
];

@Injectable()
export class MenuItems {
  getMenuitem(): Menu[] {
    return MENUITEMS;
  }
}
