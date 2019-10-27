import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';
import {Employee} from '../models/employee';
import {HttpClient, HttpErrorResponse, HttpHeaders} from '@angular/common/http';

@Injectable()
export class EmployeeService {

  constructor(private httpClient: HttpClient) {
  }

  get data(): Employee[] {
    return this.dataChange.value;
  }

  /**
   * Base path to access services.
   */
  private readonly API_URL = 'http://dummy.restapiexample.com/api/v1/';

  /**
   * Observable vs BehaviorSubject:
   *
   * Observable:  Subscribe it to get the values.
   * Subject: Same but you also have control of the values that you want to emit into it (can subscribe to it but also emit).
   * BehaviorSubject: Subject where you have to set a default value, if you subscribe to it before anything has been emitted you'll get the
   * default value.
   */
  dataChange: BehaviorSubject<Employee[]> = new BehaviorSubject<Employee[]>([]);
  // Temporarily stores data from dialogs
  dialogData: any;

  getDialogData() {
    return this.dialogData;
  }

  // TO-DO: Implement toaster service for displaying messages.
  // TO-DO: Fix error: unable to get property 'id' of undefined or null reference
  /**
   * Get all employees.
   */
  getAllEmployees(): void {

    this.httpClient.get<Employee[]>(this.API_URL + 'employees').subscribe(data => {
        this.dataChange.next(data);
      },
      (error: HttpErrorResponse) => {
        console.log(error.name + ' ' + error.message);
      });

  }

  /**
   * Add employee.
   * @param employee: new employee.
   */
  addEmployee(employee: Employee): void {

    // Temporally fix, to refresh table, make sure that id correspond to lastId + 1.
    this.dialogData = employee;

    this.httpClient.post(this.API_URL + 'create', {
      name: employee.employee_name,
      salary: employee.employee_salary,
      age: employee.employee_age
    }).subscribe(data => {
        this.dialogData = employee;
        console.log('Successfully added');
      },
      (err: HttpErrorResponse) => {
        console.log('Error occurred. Details: ' + err.name + ' ' + err.message);
      });

  }

  /**
   * Update employee data.
   * @param employee: employee to update.
   */
  updateEmployee(employee: Employee): void {

    // Temporally fix, to refresh table, make sure that id correspond to edit Id.
    this.dialogData = employee;

    this.httpClient.put(this.API_URL + 'update' + '/' + employee.id, {
      name: employee.employee_name,
      salary: employee.employee_salary,
      age: employee.employee_age
    }).subscribe(data => {
        this.dialogData = employee;
        console.log('Successfully edited');
      },
      (err: HttpErrorResponse) => {
        console.log('Error occurred. Details: ' + err.name + ' ' + err.message);
      }
    );
  }

  /**
   * Delete employee
   * @param id: employee id.
   */
  deleteEmployee(id: number): void {
    this.httpClient.delete(this.API_URL + 'delete' + '/' + id).subscribe(data => {
        console.log(data['']);
        console.log('Successfully deleted');
      },
      (err: HttpErrorResponse) => {
        console.log('Error occurred. Details: ' + err.name + ' ' + err.message);
      }
    );
  }

}
