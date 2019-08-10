import { Component, OnInit, ViewChild } from '@angular/core';
import { ActionSheetController, NavController } from '@ionic/angular';
import { AuthService } from '../servicios/auth.service'
import { AngularFirestore } from '@angular/fire/firestore';
import { Router, ActivatedRoute } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { FcmService } from '../servicios/fcm.service';

@Component({
  selector: 'app-cards',
  templateUrl: './cards.page.html',
  styleUrls: ['./cards.page.scss'],
})
export class CardsPage implements OnInit {

  //  @ViewChild('myInput') myInput;
  @ViewChild('input',{static: true}) myInput;
  public fecha: Date;
  constructor(public actionSheetController: ActionSheetController,
    private au: AuthService,
    public fire: AngularFirestore,
    public route: Router,
    public alertController: AlertController,
    private activatedRoute: ActivatedRoute,
    private fcm:FcmService
  ) {
  }
  uid: string;
  usuario = {
    cajainterna: "",
    nombre: "",
    password: "",
    telefono: "",
    uid: ""
  }
  concorreo = {
    nombre: "",
    uid: "",
    telefono: "",
    pass: "",
    cajainterna: "",
    token:""
  }
  uu: any;
  monto: number;
  correo = null;
  fechita: any;
  cajaactual: number
  cajaactual1:any
  cajaresta: number
  cajaresta1:any
  ngOnInit() {
    // this.myInput.setFocus();
    setTimeout(() => {
      this.myInput.setFocus();
    }, 150)
    
    this.correo = this.activatedRoute.snapshot.paramMap.get('correo');
    this.uu = this.au.pruebita();
    this.au.recuperaundato(this.uu).subscribe(usuario => {
      this.usuario = usuario;
    })
    this.au.recuperaconcorreo(this.correo).subscribe(concorreo => {
      this.concorreo = concorreo[0];
      console.log(this.concorreo.pass, concorreo[0]);
      console.log("caja interna" + this.usuario.cajainterna);

    })
    this.fecha = new Date();
    const mes = this.fecha.getMonth() + 1;
    this.fechita = this.fecha.getDate() + "-" + mes + "-" + this.fecha.getFullYear() + " " + this.fecha.getHours() + ":" + this.fecha.getMinutes() + ":" + this.fecha.getSeconds();
  }

  async presentAlertPrompt() {
    if (this.monto <= 0){
     this.au.ingresoinvalido()
    }else{
      if (parseInt(this.usuario.cajainterna) >= this.monto) {
        const alert = await this.alertController.create({
          header: 'Esta seguro que desea pagar Bs.' + this.monto + ' a ' + this.concorreo.nombre,
          subHeader: 'Ingrese su codigo',
          inputs: [
            {
              name: 'codigo',
              type: 'tel',
              placeholder: 'Codigo de Seguridad'
            },
          ],
          buttons: [
            {
              text: 'Cancel',
              role: 'cancel',
              cssClass: 'secondary',
              handler: () => {
                console.log('Confirm Cancel');
              }
            }, {
              text: 'Confirmar',
              handler: data => {
                console.log('este es el codigo' + data.codigo);
                console.log('contraseña del usu' + this.concorreo.pass);
                if (data.codigo == this.usuario.password) {
                  this.cajaactual =parseFloat(this.concorreo.cajainterna) + this.monto;
                  this.cajaactual1 =this.cajaactual.toFixed(2)
                  this.au.actualizacaja({ cajainterna: this.cajaactual1 }, this.concorreo.uid);
                  this.fire.collection('/user/' + this.concorreo.uid + '/ingresos').add({
                    monto: this.monto,
                    id: this.usuario.uid,
                    nombre: this.usuario.nombre,
                    telefono: this.usuario.telefono,
                    fecha: this.fecha,
                    fechita: this.fechita,
                    descripcion: 'pago',
                    saldo:this.cajaactual1,
                    identificador:'1'
                  })
                  this.cajaresta = parseFloat (this.usuario.cajainterna) - this.monto;
                  this.cajaresta1 = this.cajaresta.toFixed(2)
                  this.au.actualizacaja({ cajainterna: this.cajaresta1 }, this.uu);
                  this.fire.collection('/user/' + this.uu + '/egreso').add({
                    monto: this.monto,
                    id: this.concorreo.uid,
                    nombre: this.concorreo.nombre,
                    telefono: this.concorreo.telefono,
                    fecha: this.fecha,
                    fechita: this.fechita,
                    descripcion: 'pago',
                    saldo:this.cajaresta1,
                    identificador:'0'
                  })
                  this.au.presentToast(this.monto,this.concorreo.nombre);
                  this.fcm.notificacionforToken("GoPay","Acaba de recibir el pago de " +this.monto+ "Bs. de "+this.usuario.nombre+" ",this.concorreo.token,this.usuario.uid,"/tabs/tab2")
                  this.route.navigate(['tabs/tab2'])
                }
                else {
                  this.au.passincorrecta();
                }
              }
            }
          ]
        });
        await alert.present();
      } else {
        const alert = await this.alertController.create({
          header: 'Atención',
          message: 'Su ahorro es insuficiente para realizar el pago ',
          buttons: ['Aceptar']
        });
        await alert.present();
      }
    }
   
  }


}
