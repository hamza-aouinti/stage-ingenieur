import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { FileItem, FileUploader } from 'ng2-file-upload';
import { DataService } from 'src/app/services/data.service';
import { environment } from 'src/environments/environment';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BadInput } from 'src/app/common/errors/bad-input';
import { User } from 'src/app/authentication/user.model';

@Component({
  selector: 'app-import-user',
  templateUrl: './import-user.component.html',
  styleUrls: ['./import-user.component.scss']
})
export class ImportUserComponent implements OnInit {

  errorMessage: string='';
  private apiUrl = environment.apiUrl;
  uploader: FileUploader = new FileUploader({ url: `${this.apiUrl}user/upload` });
  selectedFile: File | null = null;
  fileTypeError = false;
  isLoading = false;

  constructor(public dialogRef: MatDialogRef<ImportUserComponent>, public dataService: DataService,
    private snackBar: MatSnackBar) { }

  ngOnInit(): void {
  }

  onFileChange(files: FileList): void {
    const file = files.item(0);
    if (file) {
      const fileType = file.type;
      if (fileType !== 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' &&
        fileType !== 'application/vnd.ms-excel') {
        this.fileTypeError = true;
        this.errorMessage = '';
      } else {
        this.selectedFile = file;
        this.fileTypeError = false;
      }
    }
  }

  onSubmit() {
    this.isLoading = true;
    console.log(this.uploader);
    
    this.uploader.onCompleteItem = (item: any, response: any, status: any, headers: any) => {
      console.log(response);
      
      const path = JSON.parse(response).path;
      // @ts-ignore
      this.dataService.postItem(new User(), '/user/importFile', { file: path })
        .subscribe(() => {
          this.dialogRef.close({});
          this.snackBar.open('Import successful', 'Dismiss', { duration: 3000 });
        },
          (error: any) => {
            this.snackBar.open(BadInput.message, 'Dismiss', { duration: 30000 });
          })
        .add(() => {
          this.isLoading = false;
        });;
    };
    if (this.selectedFile) {
      this.uploader.clearQueue();
      const fileItem = new FileItem(this.uploader, this.selectedFile, {});
      this.uploader.queue.push(fileItem);
      this.uploader.uploadItem(fileItem);
    }
    else {
      this.errorMessage = 'Please select a file.';
      return;
    }
  }

  closeDialog(): void {
    this.dialogRef.close({ event: 'Cancel' });
  }

}