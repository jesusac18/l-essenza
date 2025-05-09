import { Injectable } from '@angular/core';
import { Firestore, collection, collectionData, doc, getDocs, query, where } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class FirestoreService {

  constructor(private firestore: Firestore) {}

  getCategorias(): Observable<any[]> {
    const categoriasRef = collection(this.firestore, 'categorias');
    return collectionData(categoriasRef, { idField: 'id' });
  }

  getAllPlatos(): Observable<any[]> {
    const categoriasRef = collection(this.firestore, 'categorias');
    return collectionData(categoriasRef, { idField: 'id' }).pipe(
      switchMap(async (categorias: any[]) => {
        const allPlatoObservables = categorias.map(async (categoria) => {
          const platosSnap = await getDocs(collection(this.firestore, `categorias/${categoria.id}/platos`));
          return platosSnap.docs.map(doc => ({ id: doc.id, ...doc.data(), categoriaId: categoria.id }));
        });

        const platosArrays = await Promise.all(allPlatoObservables);
        return platosArrays.flat();
      })
    );
  }
}
