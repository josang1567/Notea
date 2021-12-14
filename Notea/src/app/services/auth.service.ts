import { Injectable } from '@angular/core';
//import sha256 from 'crypto-js/sha256';
//import hmacSHA512 from 'crypto-js/hmac-sha512';
//import Base64 from 'crypto-js/enc-base64';
//import { SecureStoragePlugin } from 'capacitor-secure-storage-plugin';
import { GoogleAuth } from '@codetrix-studio/capacitor-google-auth';
import { User } from '@codetrix-studio/capacitor-google-auth/dist/esm/user';
import { LocalStorageService } from '../services/local-storage.service';
import { Platform } from '@ionic/angular';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  public user:any;
  private isAndroid=false;

  constructor(private storage:LocalStorageService,
    private platform:Platform) {
    //this.isAndroid=platform.is("android");
    //if(!this.isAndroid)
     // GoogleAuth.init(); //ojo, error aquí, debe estar platform ready -> lee la config clientid del meta de index.html
   }
  public test(){
    //SecureStoragePlugin.set();
    //const message, nonce, path, privateKey; // ...
    //const hashDigest = sha256(nonce + message);
    //const hmacDigest = Base64.stringify(hmacSHA512(path + hashDigest, privateKey));
  }
  public async loadSession(){
    let user= await this.storage.getItem('user');
    if(user){
      user=JSON.parse(user);
      this.user=user;
    }
  }
  public async login(){
    let user:User = await GoogleAuth.signIn();
    this.user=user;
    await this.keepSession();
  }
  public async logout(){
    await GoogleAuth.signOut();
    await this.storage.removeItem('user');
    this.user=null;
  }
  public async keepSession(){
    await this.storage.setItem('user',JSON.stringify(this.user));
  }
  public isLogged():boolean{
    if(this.user) return true; else return false;
  }
}