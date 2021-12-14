import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filtro'
})
export class FiltroPipe implements PipeTransform {

  transform(arreglo:any[], texto:String): any {

    if(texto==''){
      return arreglo;
    }
    texto=texto.toLowerCase();
    
   return arreglo.filter(note=>{
      return note.title.toLowerCase().includes(texto);
    });


    
  }

}
