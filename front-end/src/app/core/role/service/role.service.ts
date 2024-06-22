import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Role } from '../model/role';

@Injectable({
  providedIn: 'root'
})
export class RoleService {

  constructor(private http: HttpClient) { }

  //LISTE PERMISSIONS
  getPermissionss() {
    return this.http.get(environment.apiUrl + 'permission/');
  }
  
}
