
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoadingController, ToastController } from '@ionic/angular';
import { Note } from '../model/Note';
import { NoteService } from '../services/note.service';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page {
  public formNota:FormGroup;
  public miLoading:HTMLIonLoadingElement;
  private miToast:HTMLIonToastElement;

  constructor(private fb:FormBuilder,
              private noteS:NoteService,
              private loading:LoadingController,
              private toast:ToastController) {
    this.formNota=this.fb.group({
      title:["",Validators.required],
      description:[""]
    });
  }

  async presentLoading() {
    this.miLoading = await this.loading.create({
      message: ''
    });
    await this.miLoading.present();
  }

  async presentToast(msg:string,clr:string) {
    this.miToast = await this.toast.create({
      message: msg,
      duration: 2000,
      color:clr
    });
    this.miToast.present();
  }

  ionViewDidEnter(){
  }

  public async addNote(){
    let newNote:Note={
      title:this.formNota.get("title").value,
      description:this.formNota.get("description").value
    }
    await this.presentLoading();
    try{
      let id=await this.noteS.addNote(newNote);
      this.miLoading && this.miLoading.dismiss();
      await this.presentToast("Nota agregada correctamente","success");
      this.formNota.reset();
    }catch(err){
      console.log(err); //<---no en producción
      this.miLoading && this.miLoading.dismiss();
      await this.presentToast("Error agregando nota","danger");
    }
    
  }

}
