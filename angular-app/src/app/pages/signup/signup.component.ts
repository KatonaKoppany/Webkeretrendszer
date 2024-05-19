import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { User } from '../../shared/models/User';

import { UserService } from '../../shared/services/user.service';
import { School } from '../../shared/models/School';
import { SchoolService } from '../../shared/services/school.service';
import { AuthService } from '../../shared/services/auth.service';
import { first } from 'rxjs';
import { TeacherStudentService } from '../../shared/services/teacher-student.service';
import { TeacherStudent } from '../../shared/models/TeacherStudent';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css',
})
export class SignupComponent implements OnInit {
  registerFormData = new FormGroup({
    firstname: new FormControl('', Validators.required),
    lastname: new FormControl('', Validators.required),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', Validators.required),
    phonenumber: new FormControl('', Validators.required),
    role: new FormControl('', Validators.required),
    schoolname: new FormControl(''),
    teacher: new FormControl(''),
  });

  schools: School[] = [];
  teachers: any[] = [];

  hide = true;
  alert = true;

  constructor(
    private router: Router,
    private auth: AuthService,
    private user: UserService,
    private school: SchoolService,
    private teacherstudent: TeacherStudentService
  ) {}

  ngOnInit(): void {
    this.school.getAll().subscribe((res) => {
      this.schools = res;
    });
  }

  async onSubmit() {
    if (this.registerFormData.valid) {
      const formdata = this.registerFormData.value;
      this.auth
        .create(formdata.email as string, formdata.password as string)
        .then((cred) => {
          const user: User = {
            id: <string>cred.user?.uid,
            firstname: <string>formdata.firstname,
            lastname: <string>formdata.lastname,
            email: <string>formdata.email,
            password: <string>formdata.password,
            phonenumber: <string>formdata.phonenumber,
            role: <string>formdata.role,
            status: 'active',
          };
          this.user
            .create(cred.user?.uid as string, user as User)
            .then((res) => {
              if (formdata.role == '1') {
                const school: School = {
                  admin_ID: <string>cred.user?.uid,
                  name: <string>formdata.schoolname,
                  user_IDs: [],
                };
                this.school.create(school).then((res) => {
                  //TODO átirányítás admin
                  console.log('admin');
                  console.log(res);
                });
              }
              if (formdata.role == '2') {
                this.school
                  .getSchoolIdByName(formdata.schoolname as string)
                  .pipe(first())
                  .subscribe((res) => {
                    const id = res[0].payload.doc.id;
                    this.school
                      .getOne(res[0].payload.doc.id)
                      .pipe(first())
                      .subscribe((res) => {
                        res?.user_IDs.push(<string>cred.user?.uid);
                        this.school
                          .update(id as string, res as School)
                          .then(() => {
                            const teacherstudent: TeacherStudent = {
                              teacher_ID: id,
                              student_IDs: [],
                            };
                            this.teacherstudent.create(
                              teacherstudent as TeacherStudent
                            );
                            //TODO átirányítás oktató
                          });
                      });
                  });
              }
              if (formdata.role == '3') {
                this.school
                  .getSchoolIdByAdminId(formdata.schoolname as string)
                  .pipe(first())
                  .subscribe((res) => {
                    console.log(res);

                    const id = res[0].payload.doc.id;

                    this.school
                      .getOne(res[0].payload.doc.id)
                      .pipe(first())
                      .subscribe((res) => {
                        res?.user_IDs.push(<string>cred.user?.uid);
                        this.school
                          .update(id as string, res as School)
                          .then(() => {
                            this.teacherstudent
                              .getById(formdata.teacher as string)
                              .pipe(first())
                              .subscribe((res) => {
                                res[0]?.student_IDs.push(
                                  <string>cred.user?.uid
                                );
                                this.teacherstudent
                                  .update(
                                    id as string,
                                    res[0] as TeacherStudent
                                  )
                                  .then(() => {
                                    //TODO átirányítás diák
                                  });
                              });
                          });
                      });
                  });
              }
            });
        })
        .catch((error) => {
          console.error(error);
        });
    } else {
      console.log('Hiba');
    }
  }

  selectedRole: string | undefined;
  onRoleChange(event: any) {
    this.selectedRole = event.value;
  }

  navigateToLogin() {
    this.router.navigate(['/login']);
  }

  selectedTeacher(event: any) {
    const id = event.value;
    this.school
      .getSchoolsByAdminId(id as string)
      .pipe(first())
      .subscribe((res) => {
        const schoolUsers = res[0].user_IDs;

        this.user.getAll().subscribe((res) => {
          const data = res.filter((teacher) =>
            schoolUsers.includes(teacher.id)
          );
          this.teachers = data;
        });
      });
  }
}
