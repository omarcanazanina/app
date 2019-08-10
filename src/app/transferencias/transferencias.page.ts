import { Component, OnInit } from '@angular/core';
import { AuthService , usu } from '../servicios/auth.service';
import { ModalController, LoadingController } from '@ionic/angular';
import { UsuarioComponent } from '../componentes/usuario/usuario.component';
import { Contacts} from '@ionic-native/contacts/ngx';
@Component({
  selector: 'app-transferencias',
  templateUrl: './transferencias.page.html',
  styleUrls: ['./transferencias.page.scss'],
})
export class TransferenciasPage implements OnInit {
  datito = []
  ContactsNone=[]
  ContactsTrue=[]
  ContactsSearch=[]
  usuario = {
    nombre: ""
  }
  sub
  uu:any
  items: any
  constructor(private au: AuthService,
     public modal: ModalController,
     private contactos:Contacts,
     public loadingController: LoadingController,
     ) {
      this.getContactos()
   }

  getItems(ev: any) {
    const val = ev.target.value;
    if (val && val.trim() != '') {
      this.ContactsTrue = this.ContactsTrue.filter((item) => {
        return (item.displayName.toLowerCase().indexOf(val.toLowerCase()) > -1);
      })
    }
  }
 

  ngOnInit() {
    this.uu = this.au.pruebita();
    this.au.recuperaundato(this.uu).subscribe(usuario => {
      this.usuario = usuario;
    })
    this.au.recuperadatos().subscribe(datos => {
      this.datito = datos;
    })
  }

  openusu(usu) {
    this.modal.create({
      component: UsuarioComponent,
      cssClass: 'my-custom-modal-css',
      componentProps: {
        usu: usu
      }
    }).then((modal) => modal.present())
  }
  getContactos(){
    let load=this.presentLoading()
    this.contactos.find(['displayName', 'phoneNumbers'], { multiple: true})
      .then(data => {
        for (let item of data) {
            if(item.phoneNumbers){
                item["numero"]=this.codigo(item.phoneNumbers[0].value)
                this.sub=this.au.verificausuarioActivo(this.codigo(item.phoneNumbers[0].value))
                .subscribe(resp=>{
                  if(resp.length>0){
                    this.ContactsTrue.push(item)
                  }else{
                    this.ContactsNone.push(item)
                  }
                })
            }
        }
       // sub.unsubscribe()
       load.then(loading =>{
         loading.dismiss();
       })
      })
      .catch(err => {
        console.log("error",err);
        alert(err)
        });
    }

  codigo(num){
    let nuevo= num.replace("+591","").trim()
    return nuevo
  }

  

  async presentLoading() {
    const loading = await this.loadingController.create({
      message: 'Cargando contactos..',
      duration: 2000
    });
    await loading.present();
    return loading;
  }
}
