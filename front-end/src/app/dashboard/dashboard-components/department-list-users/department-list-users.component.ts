import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/core/user/model/user';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-department-list-users',
  templateUrl: './department-list-users.component.html',
  styleUrls: ['./department-list-users.component.scss']
})
export class DepartmentListUsersComponent implements OnInit {
  title: string ="Départements"
  legend: string ="Classement des employès selon le département "
  result: any[]=[];
  view: any[] = [520, 340];

  // options
  showLegend: boolean = true;
  showLabels: boolean = false;
  isDoughnut: boolean = true;
  legendPosition: string = 'below';
  legendTitle: string = 'Légende';

  colorScheme = {
    domain: ['#1E88E5FF', '#FFB22BFF', '#FC4B6CFF', '#26C6DAFF', '#00897BFF']
  };

  constructor(public dataService : DataService) { 
    Object.assign(this, this.result);
   }

  ngOnInit(): void {
    this.getData()
  }

  getData() {
    // @ts-ignore
    this.dataService.getCollection(new User(), '/countUsersByDept')
      .pipe()
      .subscribe(
        (response) => {
          // @ts-ignore 
          if (response) {            
            this.result = response
          }
        });
  }

}
