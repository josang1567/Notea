import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, DocumentReference } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Note } from '../model/Note';

@Injectable({
  providedIn: 'root'
})
export class NoteService {

  private last:any=null;

  private myCollection: AngularFirestoreCollection;
  constructor(private db: AngularFirestore) {
    this.myCollection = db.collection<any>(environment.firebaseConfig.todoCollection);
  }

  public addNote(note: Note): Promise<string> {
    return new Promise(async (resolve, reject) => {
      try {
        let response: DocumentReference<firebase.default.firestore.DocumentData> =
          await this.myCollection.add({
            title: note.title,
            description: note.description
          });
        resolve(response.id);
      } catch (err) {
        reject(err);
      }
    })
  }
  /**
   * getNotesByPage() -> page=1,criteria=undefined
   * getNotesByPage(2) -> page=2, criteria=undefined
   * getNotesByPage(2,'title')
   * .orderBy(criteria,'desc')
   * @param page 
   * @param criteria 
   */
  public getNotesByPage(all?):Observable<Note[]> {
    if(all){
      this.last=null;
    }
    return new Observable((observer) => {
      let result: Note[] = [];
      let query=null;
      if(this.last){
        query=this.db.collection<any>(environment.firebaseConfig.todoCollection,
          ref => ref.limit(10).startAfter(this.last));
      }else{
        query=this.db.collection<any>(environment.firebaseConfig.todoCollection,
          ref => ref.limit(10));
      }
      
        
        query.get()
        .subscribe(
          (data: firebase.default.firestore.QuerySnapshot<firebase.default.firestore.DocumentData>) => {
            data.docs.forEach((d: firebase.default.firestore.DocumentData) => {
              this.last=d;
              let tmp = d.data(); //devuelve el objeto almacenado -> la nota con title y description
              let id = d.id; //devuelve la key del objeto
              result.push({ 'key': id, ...tmp });
              //operador spread-> 'title':tmp.title,'description':tmp.description
            })
            observer.next(result);  ///este es el return del observable que devolvemos
            observer.complete();
          }) //final del subscribe
    }); //final del return observable
  }

  //INUTILIZADO
  public getNotes(): Observable<Note[]> {
    return new Observable((observer) => {
      let result: Note[] = [];
      this.myCollection.get().subscribe(
        (data: firebase.default.firestore.QuerySnapshot<firebase.default.firestore.DocumentData>) => {
          data.docs.forEach((d: firebase.default.firestore.DocumentData) => {
            let tmp = d.data(); //devuelve el objeto almacenado -> la nota con title y description
            let id = d.id; //devuelve la key del objeto
            result.push({ 'key': id, ...tmp });
            //operador spread-> 'title':tmp.title,'description':tmp.description
          })
          observer.next(result);  ///este es el return del observable que devolvemos
          observer.complete();
        }) //final del subscribe
    }); //final del return observable
  } //final del método getNotes

  public getNote(id: string): Promise<Note> {
    return new Promise(async (resolve, reject) => {
      let note: Note = null;
      try {
        let result: firebase.default.firestore.DocumentData = await this.myCollection.doc(id).get().toPromise();
        note = {
          id: result.id,
          ...result.data()
        }
        resolve(note);
      } catch (err) {
        reject(err);
      }
    })

  }

  public remove(id: string): Promise<void> {
    return this.myCollection.doc(id).delete();
  }


  public update(note: Note): Promise<string>{
    return new Promise(async (resolve, reject) => {
      try {
        
          await this.myCollection.doc(note.key).update(
            {
              title:note.title,
           
              description:note.description
            }
          );
        resolve(note.key);
      } catch (err) {
        reject(err);
      }
    })
  }
  //modificar addNote para que no meta key, borrar nota, leer por criterio
}