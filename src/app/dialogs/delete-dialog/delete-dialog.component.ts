import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {Component, Inject} from '@angular/core';
import {EmployeeService} from '../../services/employee.service';

@Component({
  selector: 'app-delete-dialog',
  templateUrl: './delete-dialog.component.html',
  styleUrls: ['./delete-dialog.component.scss']
})

/**
 * Class implement matDialog service.
 *
 * Used to open modal dialogs with Material Design styling and animations.
 */
export class DeleteDialogComponent {

  /**
   * Construct to dialog component using angular material.
   * @param dialogRef: A dialog is opened by calling the open method with a component to be loaded and an optional config object.
   *                   The open method will return an instance of MatDialogRef
   * @param data: Employee object instance.
   * @param dataService: Employee service instance.
   */
  constructor(public dialogRef: MatDialogRef<DeleteDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any, public dataService: EmployeeService) {
  }


  onNoClick(): void {
    this.dialogRef.close();
  }

  confirmDelete(): void {
    this.dataService.deleteEmployee(this.data.id);
  }

}
