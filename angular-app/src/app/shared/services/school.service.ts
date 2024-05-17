import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { School } from '../models/School';

@Injectable({
  providedIn: 'root',
})
export class SchoolService {
  collectionName = 'schools';

  constructor(private afs: AngularFirestore) {}

  create(school: School) {
    return this.afs.collection<School>(this.collectionName).add(school);
  }

  getAll() {
    return this.afs.collection<School>(this.collectionName).valueChanges();
  }

  getOne(id: string) {
    return this.afs
      .collection<School>(this.collectionName)
      .doc(id)
      .valueChanges();
  }

  update(id: string, school: School) {
    return this.afs.collection<School>(this.collectionName).doc(id).set(school);
  }

  delete(id: string) {
    return this.afs.collection<School>(this.collectionName).doc(id).delete();
  }

  getSchoolsByAdminId(id: string) {
    return this.afs
      .collection<School>(this.collectionName, (ref) =>
        ref.where('admin_ID', '==', id)
      )
      .valueChanges();
  }

  getSchoolIdByName(name: string) {
    return this.afs
      .collection<School>(this.collectionName, (ref) =>
        ref.where('name', '==', name)
      )
      .snapshotChanges();
  }

  getSchoolByName(name: string) {
    return this.afs
      .collection<School>(this.collectionName, (ref) =>
        ref.where('name', '==', name)
      )
      .valueChanges();
  }
}
