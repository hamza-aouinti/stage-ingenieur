import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {
  params = new HttpParams();

  constructor(private http: HttpClient) { }

  getUserId(data: any) {
    this.params = this.params.append("data", data);
    return this.http.get<any>(environment.apiUrl + 'user/search', { params: this.params })
  }

  searchProjects(data: any) {
    this.params = this.params.set("status", data.status)
      .set("type", data.type)
      .set("startDate",data.startDate)
      .set("endDate",data.endDate)

    return this.http.get<any>(environment.apiUrl + 'project/search', { params: this.params })
  }


}
