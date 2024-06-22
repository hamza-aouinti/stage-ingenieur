import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { User } from 'src/app/core/user/model/user';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-list-users',
  templateUrl: './list-users.component.html',
  styleUrls: ['./list-users.component.scss']
})
export class ListUsersComponent implements OnInit {

  title: string ="Employés"
  legend: string ="Classement selon le nombre des projets"

  @ViewChild(MatTable, { static: true }) table: MatTable<any> = Object.create(null);
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  dataSource!: MatTableDataSource<User>;
  displayedColumns = ['name', 'email', 'projects'];

  users: User[] = [];
  constructor(public dataService : DataService) { }

  ngOnInit(): void {
    this.getUsersList()
  }

  getUsersList() {
    // @ts-ignore
    this.dataService.getCollection(new User(), '/countProjects')
      .pipe()
      .subscribe(
        // @ts-ignore
        (response) => {
          // @ts-ignore
          if (response) {
            // @ts-ignore            
            this.users = response;
            this.dataSource = new MatTableDataSource(this.users);
            this.dataSource.paginator = this.paginator;
            this.dataSource.sort = this.sort;
          }
        });
  }
}
