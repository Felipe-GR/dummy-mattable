import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {Component, Inject} from '@angular/core';
import {EmployeeService} from '../../services/employee.service';
import {FormControl, Validators} from '@angular/forms';
import {Employee} from '../../models/employee';

@Component({
  selector: 'app-add-dialog',
  templateUrl: './add-dialog.component.html',
  styleUrls: ['./add-dialog.component.scss']
})

/**
 * Class implement matDialog service.
 *
 * Used to open modal dialogs with Material Design styling and animations.
 */
export class AddDialogComponent {

  /**
   * Construct to dialog component using angular material.
   * @param dialogRef: A dialog is opened by calling the open method with a component to be loaded and an optional config object.
   *                   The open method will return an instance of MatDialogRef
   * @param data: Employee object instance.
   * @param dataService: Employee service instance.
   */
  constructor(public dialogRef: MatDialogRef<AddDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: Employee,
              public dataService: EmployeeService) {
  }

  /**
   * Tracks the value and validation status of an individual form control.
   */
  formControl = new FormControl('', [
    Validators.required
    // Validators.email,
  ]);

  getErrorMessage() {
    return this.formControl.hasError('required') ? 'Required field' :
      this.formControl.hasError('email') ? 'Not a valid email' :
        '';
  }

  submit() {
    // empty stuff
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  public confirmAdd(): void {
    this.dataService.addEmployee(this.data);
  }

}
