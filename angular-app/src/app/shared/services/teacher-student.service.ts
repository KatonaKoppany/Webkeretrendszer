import { Injectable } from '@angular/core';
import { TeacherStudent } from '../models/TeacherStudent';
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Injectable({
  providedIn: 'root',
})
export class TeacherStudentService {
  collectionName = 'teacherstudents';

  constructor(private afs: AngularFirestore) {}

  create(TeacherStudent: TeacherStudent) {
    return this.afs
      .collection<TeacherStudent>(this.collectionName)
      .add(TeacherStudent);
  }

  getAll() {
    return this.afs
      .collection<TeacherStudent>(this.collectionName)
      .valueChanges();
  }

  getOne(id: string) {
    return this.afs
      .collection<TeacherStudent>(this.collectionName)
      .doc(id)
      .valueChanges();
  }

  update(id: string, TeacherStudent: TeacherStudent) {
    return this.afs
      .collection<TeacherStudent>(this.collectionName)
      .doc(id)
      .set(TeacherStudent);
  }

  delete(id: string) {
    return this.afs
      .collection<TeacherStudent>(this.collectionName)
      .doc(id)
      .delete();
  }

  getIdByTeacherId(id: string) {
    return this.afs
      .collection<TeacherStudent>(this.collectionName, (ref) =>
        ref.where('teacher_ID', '==', id)
      )
      .snapshotChanges();
  }

  getById(id: string) {
    return this.afs
      .collection<TeacherStudent>(this.collectionName, (ref) =>
        ref.where('teacher_ID', '==', id)
      )
      .valueChanges();
  }
}
