import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { DataService } from 'src/app/services/data.service';
import { Task } from '../model/task';
import { DeleteTaskComponent } from '../delete-task/delete-task.component';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatSelectChange } from '@angular/material/select';
import { TaskService } from '../service/task.service';
import { environment } from 'src/environments/environment';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { TaskColumn } from '../../model/task-column';
import { completedStatus } from 'src/app/utils/variables';

@Component({
  selector: 'app-list-task',
  templateUrl: './list-task.component.html',
  styleUrls: ['./list-task.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ]
})
export class ListTaskComponent implements OnInit {

  selectedPhaseId: any;
  get id(): string {
    return this.selectedPhaseId;
  }

  @Input()
  set id(id: string) {
    this.selectedPhaseId = id;
    this.getTasksList();
  }

  tasksList: Task[] = [];
  Columns = [
    { name: 'ID', active: true },
    { name: 'Type', active: true },
    { name: 'Nom', active: true },
    { name: 'Status', active: true },
    { name: 'Priorité', active: false },
    { name: 'Date Début', active: false },
    { name: 'Date Fin', active: false },
    { name: 'Temps Estimé', active: false },
    { name: 'Temps Passé', active: false },
    { name: 'Réalisation', active: true },
    { name: 'Assigné à', active: true },
    { name: 'Actions', active: true },
  ];
  displayedColumns = ['ID', 'Type', 'Nom', 'Status', 'Priorité', 'Date Début', 'Date Fin', 'Temps Estimé', 'Temps Passé', 'Réalisation', 'Assigné à', 'Actions'];

  columnShowHideList: TaskColumn[] = [];

  dataSource = new MatTableDataSource<Task>();
  dataSourceChildren = new MatTableDataSource<Task>();
  groupedTasks: Task[] = [];
  items: any[]=[];
  panelOpenState: boolean = false;
  selectedType = 'All';
  selectedStatus = 'All';
  selectedPriority = 'All';
  startDate: Date | null = null;
  endDate: Date | null = null;
  startDateChanged: string | null = ""
  endDateChanged: string | null = ""
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private dataService: DataService, private dialog: MatDialog, private taskService: TaskService) {
  }

  ngOnInit(): void {
    this.initializeColumnProperties();
  }

  initializeColumnProperties() {
    this.Columns.forEach((element, index) => {
      this.columnShowHideList.push(
        { possition: index, name: element.name, isActive: element.active }
      );
    });
    this.toggleColumn({ position: 4, name: 'Priorité', isActive: false });
    this.toggleColumn({ position: 5, name: 'Date Début', isActive: false })
    this.toggleColumn({ position: 6, name: 'Date Fin', isActive: false })
    this.toggleColumn({ position: 7, name: 'Temps Estimé', isActive: false })
    this.toggleColumn({ position: 8, name: 'Temps Passé', isActive: false })

  }

  toggleColumn(column: any) {
    if (column.isActive) {
      if (column.possition > this.displayedColumns.length - 1) {
        this.displayedColumns.push(column.name);
      } else {
        this.displayedColumns.splice(column.possition, 0, column.name);
      }
    } else {
      let i = this.displayedColumns.indexOf(column.name);
      let opr = i > -1 ? this.displayedColumns.splice(i, 1) : undefined;
    }
  }

  getTasksList() {
    //@ts-ignore
    this.dataService.getCollection(new Task(), '/' + this.selectedPhaseId)
      .pipe()
      .subscribe((result) => {
        if (result) {
          this.tasksList = result;
          // Group child tasks under their respective parent tasks
          const tasksMap = new Map();
          this.groupedTasks=[]
          for (const task of this.tasksList) {
            if (!task.parentId) {
              // Task without parent, add it to the grouped tasks list
              this.groupedTasks.push(task);
            } else {
              // Task with parent, add it as a child of the parent task
              const parentTask = tasksMap.get(task.parentId);
              if (parentTask) {
                parentTask.subtasks = parentTask.subtasks || [];
                parentTask.subtasks.push(task);
              }
            }
            tasksMap.set(task.id, task);
          }

          this.dataSource = new MatTableDataSource(this.tasksList);
          this.dataSource.paginator = this.paginator;
          this.items=this.getItems(this.groupedTasks,null,0)          
        }
      });
  }

  expanded(item:any)
  {
    item.expanded=!item.expanded;
    this.items=this.getItems(this.groupedTasks,null,0)

  }
  getItems(data:any, items:any,index:any) {
    data.forEach((x:any) => {
      if (!items)
        items=[];
      items.push(x);
      items[items.length-1].index=index
      if (x.subtasks && x.expanded)
        this.getItems(x.subtasks,items,index+1);
    }
    )
    return items;
  }
  openDeleteDialog(obj: any) {
    const dialogRef = this.dialog.open(DeleteTaskComponent, {
      data: obj
    });
    dialogRef.afterClosed().subscribe(result => {
      this.getTasksList();
    })
  }

  doneTask(obj: any) {
    // @ts-ignore
    const taskModel = new Task();
    taskModel.setId(obj.id)
    let task = {
      name: obj.name,
      type: obj.type,
      status: completedStatus,
      priority: obj.priority,
      startDate: obj.startDate,
      endDate: obj.endDate,
      estimatedTime: obj.estimatedTime,
      userId: obj.userId,
      parentId: obj.parentId,
      phaseId: obj.phaseId,
      realisation: 100
    };
    // @ts-ignore
    this.dataService.putItem(taskModel, '/edit', task)
      .pipe()
      .subscribe({
        next: (res) => {
          this.getTasksList()
        }
      })
  }

  /*doneChildrenTasks(element: Task): boolean {
    let cpt = 0
    let test = true
    if (element.subtasks) {
      element.subtasks.forEach((task: any) => {
        if (task.status === completedStatus)
          cpt = cpt + 1
      })
      if (cpt !== element.subtasks.length)
        test = false
    }
    return test
  }*/

  togglePanel() {
    this.panelOpenState = !this.panelOpenState
  }

  applyFilter(filterValue: string): void {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  searchTasks() {
    const params = {
      type: this.selectedType,
      status: this.selectedStatus,
      priority: this.selectedPriority,
      startDate: this.startDate ? this.startDateChanged : null,
      endDate: this.endDate ? this.endDateChanged : null,
      phaseId:this.selectedPhaseId
    };
    this.taskService.searchTasks(params).subscribe((data) => {
      this.tasksList = data
      
      this.dataSource = new MatTableDataSource(this.tasksList);
    })
  }

  applyTypeFilter(event: MatSelectChange) {
    this.selectedType = event.value;
    this.searchTasks();
  }

  applyStatusFilter(event: MatSelectChange) {
    this.selectedStatus = event.value;
    this.searchTasks();
  }

  applyPriorityFilter(event: MatSelectChange) {
    this.selectedPriority = event.value;
    this.searchTasks();
  }

  applyDateFilter(): void {
    if (this.startDate) {
      this.startDateChanged = this.startDate.toISOString();
    }
    else {
      this.startDateChanged = null;
    }
    if (this.endDate) {
      this.endDateChanged = this.endDate.toISOString();
    }
    else {
      this.endDateChanged = null;
    }
    this.searchTasks()
  }

  taille(): boolean {
    if (this.tasksList.length == 0)
      return true;
    else
      return false;
  }

  getTypeClass(type: string): string {
    switch (type) {
      case 'Depannage':
        return 'bg-warning';
      case 'Realisation':
        return 'bg-danger';
      case 'Retouche':
        return 'bg-primary';
      case 'Remplacement':
        return 'bg-secondary';
     
      default:
        return 'bg-primary';
    }
  }

  getUrl(id: string) {
    if (id) {
      const url = `${environment.gitLabBaseUrl}${environment.gitlabProjectId}/${environment.gitlabCommitPath}${id}`;
      window.open(url, '_blank');
    }
  }
  getDataSource(tasks: Task[]): MatTableDataSource<Task> {
    this.dataSourceChildren = new MatTableDataSource(tasks);
    this.dataSourceChildren.paginator = this.paginator;
    return this.dataSourceChildren;
  }


}

