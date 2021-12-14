import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoadingController, ModalController, ToastController } from '@ionic/angular';
import { Note } from 'src/app/model/Note';
import { NoteService } from 'src/app/services/note.service';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.page.html',
  styleUrls: ['./modal.page.scss'],
})
export class ModalPage implements OnInit {

  @Input() note:Note;
  public formNota:FormGroup;
  public miLoading:HTMLIonLoadingElement;
  private miToast:HTMLIonToastElement;

  constructor(public modalController: ModalController,private fb:FormBuilder,
    private noteS:NoteService,
    private loading:LoadingController,
    private toast:ToastController) {}

 

  ngOnInit() {
    console.log(this.note);
    this.formNota=this.fb.group({
      title:[this.note.title,Validators.required],
      description:[this.note.description]
    });
  }

  async close(){
    this.modalController.dismiss();
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


public async updateNote(){
    let newNote:Note={
      key:this.note.key,
      title:this.formNota.get("title").value,
      description:this.formNota.get("description").value
    }
    await this.presentLoading();
    try{
      let id=await this.noteS.update(newNote);
      this.miLoading && this.miLoading.dismiss();
      await this.presentToast("Nota editada correctamente","success");
      this.formNota.reset();
    }catch(err){
      console.log(err); //<---no en producción
      this.miLoading && this.miLoading.dismiss();
      await this.presentToast("Error editando nota","danger");
    }
    this.modalController.dismiss();
  }

}
