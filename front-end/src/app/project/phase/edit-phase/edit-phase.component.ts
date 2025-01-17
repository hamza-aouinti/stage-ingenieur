import { Component, Inject, OnInit, Optional } from '@angular/core';
import { Phase } from '../model/phase';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DataService } from 'src/app/services/data.service';
import Swal from 'sweetalert2';
import { MAT_DATE_LOCALE, DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import { CustomDateAdapter, MY_DATE_FORMATS } from '../../utils/format-date';
import { completedStatus, inProgressStatus, newStatus } from 'src/app/utils/variables';

@Component({
  selector: 'app-edit-phase',
  templateUrl: './edit-phase.component.html',
  styleUrls: ['./edit-phase.component.scss'],
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: 'en-US' }, // Change the locale if necessary
    { provide: DateAdapter, useClass: CustomDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS },
  ],
})
export class EditPhaseComponent implements OnInit {
  phaseForm: FormGroup = Object.create(null);
  currentStatus: string = '';
  status: string[] = [];

  constructor(private formBuilder: FormBuilder, private dataService: DataService,
    public dialogRef: MatDialogRef<EditPhaseComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: Phase) {
  }

  ngOnInit(): void {
    this.phaseForm = this.formBuilder.group(
      {
        title: null,
        description: [null, Validators.maxLength(120)],
        startDate: null,
        endDate: null,
        status: [null, Validators.required],
      });

    if (this.data) {
      this.currentStatus = this.data.status;
      this.setSatus()
      this.phaseForm.controls['title'].setValue(this.data.title)
      this.phaseForm.controls['description'].setValue(this.data.description)
      this.phaseForm.controls['startDate'].setValue(this.data.startDate)
      this.phaseForm.controls['endDate'].setValue(this.data.endDate)
      this.phaseForm.controls['status'].setValue(this.data.status)
    }
  }

  setSatus() {
    switch (this.currentStatus) {
      case newStatus: {
        this.status = [newStatus, inProgressStatus];
        break;
      }
      case inProgressStatus: {
        this.status = [inProgressStatus, completedStatus];
        break;
      }
      case completedStatus: {
        this.status = [completedStatus];
        break;
      }
    }
  }

  submit() {
    if (this.phaseForm.valid) {
      // @ts-ignore
      const phaseModel = new Phase();
      phaseModel.setId(this.data.id);
      let phase = {
        title: this.phaseForm.value.title,
        description: this.phaseForm.value.description,
        startDate: this.phaseForm.value.startDate,
        endDate: this.phaseForm.value.endDate,
        status: this.phaseForm.value.status,
        projectId: this.data.projectId
      };
      // @ts-ignore
      this.dataService.putItem(phaseModel, '/edit', phase)
        .pipe()
        .subscribe({
          next: (res: any) => {
            this.closeDialog()
            const Toast = Swal.mixin({
              toast: true,
              position: 'top-end',
              showConfirmButton: false,
              timer: 3000,
              timerProgressBar: true,
              didOpen: (toast) => {
                toast.addEventListener('mouseenter', Swal.stopTimer)
                toast.addEventListener('mouseleave', Swal.resumeTimer)
              }
            })

            Toast.fire({
              icon: 'success',
              title: 'Phase Modifié avec Succès.'
            })
          }
        })
    }
  }

  closeDialog(): void {
    this.dialogRef.close({ event: 'Cancel' });
  }

}
