import { Component, ViewChild } from '@angular/core';
import { Camera, CameraResultType, CameraSource, ImageOptions, Photo } from '@capacitor/camera';
import { IonToggle, LoadingController, ToastController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { LocalStorageService } from '../services/local-storage.service';
import { OCR, OCRResult, OCRSourceType } from '@awesome-cordova-plugins/ocr/ngx';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NoteService } from '../services/note.service';
import { Note } from '../model/Note';
@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page {
  public formNota:FormGroup;
  public miLoading:HTMLIonLoadingElement;
  private miToast:HTMLIonToastElement;

  @ViewChild('mitoogle', { static: false }) mitoogle: IonToggle;
  public image: any;
  public url:string;
  public ImageText:string;
  constructor(
    private traductor: TranslateService,
     private storage: LocalStorageService,
      private ocr:OCR,
      private fb:FormBuilder,
              private noteS:NoteService,
              private loading:LoadingController,
              private toast:ToastController)
   {
    traductor.setDefaultLang("en");
    traductor.use("en");
    traductor.get("TAKE A PICTURE").toPromise().then(data => {
      console.log(data);
    });
    this.formNota=this.fb.group({
      title:["",Validators.required],
      description:[""]
    });

  }

  public async hazFoto() {

    let options: ImageOptions = {
      resultType: CameraResultType.Uri,
      allowEditing: false,
      quality: 90,
      source: CameraSource.Camera
    }
    let result: Photo = await Camera.getPhoto(options);
    this.image = result.webPath;
    this.url=result.path;
    this.leerImagen();
  }

  async leerImagen(){
    await this.ocr.recText(OCRSourceType.NORMFILEURL, this.url)
  .then((res: OCRResult) => {
    let result=res.blocks.blocktext;
    let messages:string="";
    for(let s of result){
      messages+=s+" ";
    }
    this.ImageText=messages;
    this.formNota.get("description").setValue(this.ImageText);

  })
  .catch((error: any) => console.error(error));
  }

  ionViewDidEnter() {
    console.log(this.traductor.getDefaultLang());
    const lang = this.traductor.getDefaultLang();
    if (lang == 'es') {
      this.mitoogle.checked = false;
    } else {
      this.mitoogle.checked = true;
    }
  }


  public async cambiaIdioma(event) {
    console.log(event)
    if (event && event.detail && event.detail.checked) {
      await this.storage.setItem('lang', { lang: 'en' });
      await this.traductor.use('en');
    } else {
      await this.storage.setItem('lang', { lang: 'es' });
      this.traductor.use('es');
    }
  }
  

//--------------agregar------------------

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
