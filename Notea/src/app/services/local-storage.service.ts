import { Injectable } from '@angular/core';
import {Storage} from '@capacitor/storage';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {

  constructor() { }
/**
 * 
 * @param Key 
 * @param value object 
 * @returns 
 */

  public async setItem(Key:string, value :any):Promise<boolean>{
    let result:boolean=false;
    
    try {
      await Storage.set({
        key:Key,
        value:JSON.stringify(value)
      })  
    } catch (err) {
      console.error(err);
    }

    return Promise.resolve(result);
  }

  public async getItem(key:string):Promise<any>{
    let value= null;
    try {
      value= await Storage.get({key:key});
      value= value.value;
      if(value!=null){
        value= JSON.parse(value);
      }
    } catch (err) {
      console.error(err);
    }
    return Promise.resolve(value);
  }

  public async removeItem(key:string):Promise<boolean>{
    let result=false;
    try {
      await  Storage.remove({key:key});
        result= true;
    } catch (err) {
      console.error(err);
    }
    return Promise.resolve(result);
  }
}
