import { Injectable } from '@angular/core';
import { Firestore, collection, collectionData } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FirestoreService {

  constructor(private firestore: Firestore) {}

  getCategorias(): Observable<any[]> {
    const categoriasRef = collection(this.firestore, 'categorias');
    return collectionData(categoriasRef, { idField: 'id' });
  }

  getPlatos(): Observable<any[]> {
    const platosRef = collection(this.firestore, 'platos');
    return collectionData(platosRef, { idField: 'id' });
  }
}
