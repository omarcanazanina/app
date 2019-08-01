import { Component, OnInit } from '@angular/core';
import { AuthService } from '../servicios/auth.service';

import {  LoadingController } from '@ionic/angular';

import { Router } from '@angular/router';
//import { NavParams} from '@ionic/angular';

@Component({
  selector: 'app-indexconfirmacion',
  templateUrl: './indexconfirmacion.page.html',
  styleUrls: ['./indexconfirmacion.page.scss'],
})
export class IndexconfirmacionPage implements OnInit {
  constructor(
   //private platform: Platform,
   // private splashScreen: SplashScreen,
    //private statusBar: StatusBar,
    private au: AuthService,
    //private fcm: FCM,
    //public fire: AngularFirestore,
    private loadingController:LoadingController,
    private router:Router) { }
  usuario = {
    nombre: ""
  }
  uu: any;
  tokencel: any;
  actoken:any;
  ngOnInit() {

    this.uu = this.au.pruebita();
    this.au.recuperaundato(this.uu).subscribe(usuario => {
      this.usuario = usuario;
    })

   /* this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
      this.fcm.getToken().then(
        (token: string) => {
          console.log("este es el token para este dispositivo" + token);
          this.tokencel = token;
        }

      ).catch(err => {
        console.log(err);

      });*/


     /* this.fcm.onTokenRefresh().subscribe((token1: string) => {
        console.log("actualizacion de token" + token1);
        this.actoken=token1;
      });

      this.fcm.onNotification().subscribe(data => {
        if (data.wasTapped) {
          console.log("esta en seguno plano" + JSON.stringify(data));
        } else {
          console.log("esta en primer plano" + JSON.stringify(data));

        }
      }, error => {
        console.log("error" + error);

      })

    });*/



  }
  /*guardartoken() {
    this.fire.collection('devices').doc(this.uu).set({
      token: this.tokencel,
      prueba: 'prueba'
    })
    console.log("despues de la prueba este es el token:" + this.tokencel);
    console.log("dactualizacion de la prueba:" + this.actoken);
  }*/

  async presentLoading() {
    const loading = await this.loadingController.create({
      message: "Guardando",
      duration: 1000
    });
    await loading.present();
    return loading
  }

  ingresar(){
    let load = this.presentLoading();
    this.router.navigate(["/tabs/tab2"])
  }



}
