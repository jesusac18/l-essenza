import { Injectable } from '@angular/core';
import { Firestore, collection, collectionData, doc, docData, getDocs, query, where, addDoc } from '@angular/fire/firestore';
import { getDoc } from 'firebase/firestore';
import { Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

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

  getPlatoById(categoriaId: string, platoId: string): Observable<any | null> {
    const platoRef = doc(this.firestore, `categorias/${categoriaId}/platos/${platoId}`);
    return docData(platoRef, { idField: 'id' }).pipe(
      map((data) => (data ? { ...data, categoriaId } : null))
    );
  }

  getCategoriaById(categoriaId: string): Observable<any | null> {
    const categoriaRef = doc(this.firestore, `categorias/${categoriaId}`);
    return docData(categoriaRef, { idField: 'id' }).pipe(
      map((data) => (data ? data : null))
    );
  }

  getPlatosByCategoriaId(categoriaId: string): Observable<any[]> {
    const platosRef = collection(this.firestore, `categorias/${categoriaId}/platos`);
    return collectionData(platosRef, { idField: 'id' }).pipe(
      map(platos => platos.map(plato => ({ ...plato, categoriaId })))
    );
  }

  async existeReserva(fecha: string, hora: string): Promise<boolean> {
    const reservasRef = collection(this.firestore, 'reservas');
    const q = query(reservasRef, where('fecha', '==', fecha), where('hora', '==', hora));
    const snapshot = await getDocs(q);
    return !snapshot.empty;
  }

  async existeReservaMesa(fecha: string, hora: string, mesa: string): Promise<boolean> {
    const reservasRef = collection(this.firestore, 'reservas');
    const q = query(reservasRef, where('fecha', '==', fecha), where('hora', '==', hora), where('mesa', '==', mesa));
    const snapshot = await getDocs(q);
    return !snapshot.empty;
  }

  async guardarReserva(reserva: any): Promise<void> {
    const reservasRef = collection(this.firestore, 'reservas');
    await addDoc(reservasRef, reserva);
  }
}
