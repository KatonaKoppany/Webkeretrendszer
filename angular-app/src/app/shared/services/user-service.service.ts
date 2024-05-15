import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { User } from '../models/User';

@Injectable({
  providedIn: 'root',
})
export class UserServiceService {
  collectionName = 'users';

  constructor(private afs: AngularFirestore) {}

  create(id: string, user: User) {
    return this.afs.collection<User>(this.collectionName).doc(id).set(user);
  }

  getAll() {
    return this.afs.collection<User>(this.collectionName).valueChanges();
  }

  getById(id: string) {
    return this.afs
      .collection<User>(this.collectionName)
      .doc(id)
      .valueChanges();
  }

  update(id: string, user: User) {
    return this.afs.collection<User>(this.collectionName).doc(id).set(user);
  }

  delete(id: string) {
    return this.afs.collection<User>(this.collectionName).doc(id).delete();
  }
}
