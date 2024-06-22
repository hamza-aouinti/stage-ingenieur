import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { User } from '../model/user';
import { AddUserComponent } from '../add-user/add-user.component';
import { EditUserComponent } from '../edit-user/edit-user.component';
import { DeleteUserComponent } from '../delete-user/delete-user.component';
import { AuthenticationService } from '../../../authentication/authentication.service';
import { DataService } from '../../../services/data.service';
import { read, utils, writeFile } from 'xlsx'
import { ImportUserComponent } from '../import-user/import-user.component';
import { UserService } from '../service/user.service';

@Component({
  selector: 'app-list-user',
  templateUrl: './list-user.component.html',
  styleUrls: ['./list-user.component.scss']
})
export class ListUserComponent implements OnInit {

  @ViewChild(MatTable, { static: true }) table: MatTable<any> = Object.create(null);
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  dataSource!: MatTableDataSource<User>;
  displayedColumns = ['name', 'email', 'phoneNumber', 'roleId', 'action'];

  users: User[] = [];
  searchKey: string='';

  selectedFile!: File;
  importResponse: any = null;

  constructor(private dataService: DataService, private authServ: AuthenticationService, public dialog: MatDialog, private userService:UserService) {
    this.getUsersList();
  }

  ngOnInit(): void {
  }

  getUsersList() {
    // @ts-ignore
    this.dataService.getCollection(new User(), null)
      .pipe()
      .subscribe(
        (response: { users: any; }) => {
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

  applyFilter(filterValue: string): void {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  openAddDialog() {
    const dialogRef = this.dialog.open(AddUserComponent,{
      width: '50%',
    });
    dialogRef.afterClosed().subscribe(result => {
      this.getUsersList()
    });
  }

  openEditDialog(row: any) {
    const dialogRef = this.dialog.open(EditUserComponent, {
      width: '50%',
      data: row
    });
    dialogRef.afterClosed().subscribe(result => {
      this.getUsersList()
    });
  }

  openDeleteDialog(obj: any) {
    const dialogRef = this.dialog.open(DeleteUserComponent, {
      data: obj,
    });
    dialogRef.afterClosed().subscribe(result => {
      this.getUsersList();
    })
  }

  openImportDialog() {
    const dialogRef = this.dialog.open(ImportUserComponent);

    dialogRef.afterClosed().subscribe(result => {
      this.getUsersList()
    });
  }

  import() {
    /*  const formData = new FormData();
      formData.append('file', this.selectedFile);
  
      this.userService.importUsers(formData).subscribe(
        response => {
          this.importResponse = response;
        },
        error => {
          console.error(error);
        }
      );*/
  }
  csvImport($event: any) {
    const files = $event.target.files;
    if (files.length) {
      const file = files[0];
      const reader = new FileReader();
      reader.onload = (event: any) => {
        const wb = read(event.target.result);
        const sheets = wb.SheetNames;

        if (sheets.length) {
          const rows = utils.sheet_to_json(wb.Sheets[sheets[0]])
       //   this.users = rows
        }
      }
      reader.readAsArrayBuffer(file)
    }
  }

  hasPermission(path: any): boolean {
    const user = this.authServ.getUser()
    const permissions = user.role.permissions.map((permission: any) => permission.path)
    if (permissions.includes('/user/' + path))
      return true
    else return false
  }

  search() {
    if (this.searchKey) {
      this.userService.searchUsers(this.searchKey).subscribe(response => {
          this.users = response;
      //    this.dataSource = new MatTableDataSource(this.users);
        });
    } else {
      this.users = [];
    }
  }
}
