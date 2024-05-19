import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { UserStatusComponent } from '../user-status/user-status.component';
import { UserAddEditComponent } from '../user-add-edit/user-add-edit.component';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { User } from '@angular/fire/auth';
import { SchoolService } from '../../shared/services/school.service';
import { first, forkJoin } from 'rxjs';
import { UserService } from '../../shared/services/user.service';
import { TeacherStudentService } from '../../shared/services/teacher-student.service';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrl: './user-list.component.css',
})
export class UserListComponent implements OnInit {
  constructor(
    public dialog: MatDialog,
    private afUser: AngularFireAuth,
    private school: SchoolService,
    private userService: UserService,
    private teacherstudent: TeacherStudentService
  ) {}
  user: User | null = null;

  displayedColumns: string[] = [
    'lastname',
    'firstname',
    'email',
    'phonenumber',
    'status',
    'action',
  ];

  dataSource!: MatTableDataSource<any>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  ngOnInit(): void {
    this.afUser.authState.subscribe((user) => {
      if (user) {
        this.user = user as User;
        this.getUsersList();
      }
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  getUsersList() {
    this.school
      .getSchoolsByAdminId(this.user?.uid as string)
      .pipe(first())
      .subscribe((schools) => {
        const schoolUsers = schools[0].user_IDs;

        this.userService.getAll().subscribe((res) => {
          const data = res.filter((teacher) =>
            schoolUsers.includes(teacher.id)
          );

          this.dataSource = new MatTableDataSource(data);
          this.dataSource.sort = this.sort;
          this.dataSource.paginator = this.paginator;
        });
      });
  }

  openAdd(): void {
    const dialogRef = this.dialog.open(UserAddEditComponent, {});
    dialogRef.afterClosed().subscribe((res) => {
      this.getUsersList();
    });
  }

  openEdit(data: any): void {
    console.log(data);

    const dialogRef = this.dialog.open(UserAddEditComponent, { data: data });
    dialogRef.afterClosed().subscribe((res) => {
      this.getUsersList();
    });
  }

  block(data: any, id: string): void {
    let userData: any = data;
    const dialogRef = this.dialog.open(UserStatusComponent, {
      data: { userData, id },
    });

    dialogRef.afterClosed().subscribe((res) => {
      this.getUsersList();
    });
  }

  restore(data: any, id: string): void {
    let userData: any = data;
    const dialogRef = this.dialog.open(UserStatusComponent, {
      data: { userData, id },
    });

    dialogRef.afterClosed().subscribe((res) => {
      this.getUsersList();
    });
  }
}
