import { HttpParams, HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  params = new HttpParams();

  constructor(private http: HttpClient) { }

  getStatistcsProject(type: any) {
    this.params = this.params.append("type", type);
    return this.http.get<any>(environment.apiUrl + 'project/statistics', { params: this.params })
  }
  
}
