import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {EmployeeService} from './services/employee.service';
import {HttpClient} from '@angular/common/http';
import {MatDialog} from '@angular/material/dialog';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {Employee} from './models/employee';
import {DataSource} from '@angular/cdk/collections';
import {AddDialogComponent} from './dialogs/add-dialog/add-dialog.component';
import {EditDialogComponent} from './dialogs/edit-dialog/edit-dialog.component';
import {DeleteDialogComponent} from './dialogs/delete-dialog/delete-dialog.component';
import {BehaviorSubject, fromEvent, merge, Observable} from 'rxjs';
import {map} from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  /**
   * Display columns in material table.
   */
  displayedColumns = ['id', 'employee_name', 'employee_salary', 'employee_age', 'profile_image', 'actions'];

  /**
   * Database to show data.
   */
  exampleDatabase: EmployeeService | null;

  /**
   * Row of data
   */
  dataSource: ExampleDataSource | null;

  /**
   * Page index
   */
  index: number;

  /**
   * Id element number.
   */
  id: number;

  /**
   * Construct index face component using angular material.
   * @param httpClient: Offers a simplified client HTTP API for Angular applications that rests on the XMLHttpRequest interface exposed
   *                    by browsers
   * @param dialog: Used to open modal dialogs with Material Design styling and animations.
   * @param dataService: Instance of services.
   */
  constructor(public httpClient: HttpClient,
              public dialog: MatDialog,
              public dataService: EmployeeService) {
  }

  /**
   * @ViewChild: Property decorator that configures a view query. The change detector looks for the first element or the directive matching
   * the selector in the view DOM.
   * If the view DOM changes, and a new child matches the selector, the property is updated
   */

  /**
   * @MatPaginator: Component to provide navigation between paged information.
   */
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;

  /**
   * @MatSort: Used to add sorting state and display to tabular data.
   */
  @ViewChild(MatSort, {static: true}) sort: MatSort;

  /**
   * @filter: Used to filter data fields of material table.
   */
  @ViewChild('filter', {static: true}) filter: ElementRef;

  /**
   * Initialized all data-bound properties of a directive.
   */
  ngOnInit() {
    this.loadData();
  }

  /**
   * Refresh material table.
   */
  refresh() {
    this.loadData();
  }

  /**
   * Add New employee of material table.
   * @param employee: new employee row.
   */
  addNew(employee: Employee) {

    // Open add dialog component.
    const dialogRef = this.dialog.open(AddDialogComponent, {
      data: {employee}
    });

    // Action after close dialog component.
    dialogRef.afterClosed().subscribe(result => {
      if (result === 1) {
        // After dialog is closed we're doing frontend updates.
        // For add we're just pushing a new row inside DataService.
        this.exampleDatabase.dataChange.value.push(this.dataService.getDialogData());
        this.refreshTable();
      }
    });

  }

  /**
   * Edit employee.
   * @param i: index row of data table.
   * @param id: id of selected employee.
   * @param employee_name: new name of selected employee.
   * @param employee_salary: new salary of selected employee.
   * @param employee_age: new salary of selected employee.
   */
  // tslint:disable-next-line:variable-name
  startEdit(i: number, id: number, employee_name: string, employee_salary: number, employee_age: number) {

    // index row is used just for debugging proposes and can be removed
    this.index = i;
    this.id = id;

    // Open edit dialog component.
    const dialogRef = this.dialog.open(EditDialogComponent, {
      data: {
        id,
        employee_name,
        employee_salary,
        employee_age
      }
    });

    // Action after close dialog component.
    dialogRef.afterClosed().subscribe(result => {
      if (result === 1) {
        // When using an edit things are little different, firstly we find record inside DataService by id.
        const foundIndex = this.exampleDatabase.dataChange.value.findIndex(x => x.id === this.id);
        // Then you update that record using data from dialogData (values you entered).
        this.exampleDatabase.dataChange.value[foundIndex] = this.dataService.getDialogData();
        // And lastly refresh table
        this.refreshTable();
      }
    });

  }

  /**
   * Delete employee.
   * @param i: index row of data table.
   * @param id: id of selected employee.
   * @param employee_name: name of selected employee.
   * @param employee_salary: name salary of selected employee.
   * @param employee_age: salary of selected employee.
   */
  // tslint:disable-next-line:variable-name
  deleteItem(i: number, id: number, employee_name: string, employee_salary: number, employee_age: number) {

    // index row is used just for debugging proposes and can be removed
    this.index = i;
    this.id = id;

    // Open edit dialog component.
    const dialogRef = this.dialog.open(DeleteDialogComponent, {
      data: {
        id,
        employee_name,
        employee_salary,
        employee_age
      }
    });

    // Action after close dialog component.
    dialogRef.afterClosed().subscribe(result => {
      if (result === 1) {
        const foundIndex = this.exampleDatabase.dataChange.value.findIndex(x => x.id === this.id);
        // for delete we use splice in order to remove single object from DataService
        this.exampleDatabase.dataChange.value.splice(foundIndex, 1);
        this.refreshTable();
      }
    });

  }

  /**
   * Refresh table using paginator.
   */
  private refreshTable() {
    this.paginator._changePageSize(this.paginator.pageSize);
  }

  /**
   * Load data in table.
   */
  public loadData() {

    // Change default paginator message.
    this.paginator._intl.itemsPerPageLabel = 'Employees per page';

    // Instance services.
    this.exampleDatabase = new EmployeeService(this.httpClient);

    // Data row of employee.
    this.dataSource = new ExampleDataSource(this.exampleDatabase, this.paginator, this.sort);

    // Add event to table, add filter event.
    fromEvent(this.filter.nativeElement, 'keyup')
      .subscribe(() => {
        if (!this.dataSource) {
          return;
        }
        // nativeElement: Reference to the native element of the DOM on which want to act.
        this.dataSource.filter = this.filter.nativeElement.value;
      });

  }

}

/**
 * Class to manage content of table.
 */
export class ExampleDataSource extends DataSource<Employee> {

  /**
   * @_filterChange: Filter data using BehaviorSubject.
   * @BehaviorSubject: Subject used to filter the data and return filter dataset.
   */
    // tslint:disable-next-line:variable-name
  _filterChange = new BehaviorSubject('');

  /**
   * Get filter data.
   */
  get filter(): string {
    return this._filterChange.value;
  }

  /**
   * Set filter criteria.
   * @param filter: criteria.
   */
  set filter(filter: string) {
    this._filterChange.next(filter);
  }

  /**
   * Filtered data.
   */
  filteredData: Employee[] = [];

  /**
   * Show data on material table.
   */
  renderedData: Employee[] = [];

  /**
   * Constructor of material table.
   * @param _exampleDatabase: Employee data.
   * @param _paginator: Pages of table.
   * @param _sort: Used to add sorting state and display data.
   */
  // tslint:disable-next-line:variable-name
  constructor(public _exampleDatabase: EmployeeService,
              // tslint:disable-next-line:variable-name
              public _paginator: MatPaginator,
              // tslint:disable-next-line:variable-name
              public _sort: MatSort) {
    super();
    // Reset to the first page when the user changes the filter.
    this._filterChange.subscribe(() => this._paginator.pageIndex = 0);
  }

  /**
   * Connect function called by the table to retrieve one stream containing the data to render.
   */
  connect(): Observable<Employee[]> {

    // Listen for any changes in the base data, sorting, filtering, or pagination
    const displayDataChanges = [
      this._exampleDatabase.dataChange,
      this._sort.sortChange,
      this._filterChange,
      this._paginator.page
    ];

    // Get employees.
    this._exampleDatabase.getAllEmployees();

    // Display data.
    return merge(...displayDataChanges).pipe(map(() => {
        // Filter data
        this.filteredData = this._exampleDatabase.data.slice().filter((employee: Employee) => {
          // tslint:disable-next-line:max-line-length
          const searchStr = (employee.id + employee.employee_name + employee.employee_salary + employee.employee_salary).toLowerCase();
          return searchStr.indexOf(this.filter.toLowerCase()) !== -1;
        });

        // Sort filtered data
        const sortedData = this.sortData(this.filteredData.slice());

        // Grab the page's slice of the filtered sorted data.
        const startIndex = this._paginator.pageIndex * this._paginator.pageSize;
        this.renderedData = sortedData.splice(startIndex, this._paginator.pageSize);
        return this.renderedData;
      }
    ));

  }

  disconnect() {
  }

  /**
   * Returns a sorted copy of the database data.
   * @param data: employees to show.
   */
  sortData(data: Employee[]): Employee[] {
    if (!this._sort.active || this._sort.direction === '') {
      return data;
    }

    // Filter condition.
    return data.sort((a, b) => {

      let propertyA: number | string = '';
      let propertyB: number | string = '';

      switch (this._sort.active) {
        case 'id':
          [propertyA, propertyB] = [a.id, b.id];
          break;

        case 'employee_name':
          [propertyA, propertyB] = [a.employee_name, b.employee_name];
          break;

        case 'employee_salary':
          [propertyA, propertyB] = [a.employee_salary, b.employee_salary];
          break;

        case 'employee_age':
          [propertyA, propertyB] = [a.employee_age, b.employee_age];
          break;

      }

      // Determines whether a value is an illegal number and assign valid argument.
      const valueA = isNaN(+propertyA) ? propertyA : +propertyA;
      const valueB = isNaN(+propertyB) ? propertyB : +propertyB;
      return (valueA < valueB ? -1 : 1) * (this._sort.direction === 'asc' ? 1 : -1);

    });

  }

}
