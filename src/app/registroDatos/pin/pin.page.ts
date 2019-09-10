import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { LoadingController } from '@ionic/angular';
import { AuthService } from 'src/app/servicios/auth.service';
import { FCM } from '@ionic-native/fcm/ngx';

@Component({
  selector: 'app-pin',
  templateUrl: './pin.page.html',
  styleUrls: ['./pin.page.scss'],
})
export class PinPage implements OnInit {
  public mask = [/[0-9]/, /\d/, /\d/, /\d/]
  constructor(private activate: ActivatedRoute,
    private route: Router,
    private loadingController: LoadingController,
    private au: AuthService,
    private fcm: FCM) { }
  nombre = null
  email = null
  telefono = null
  contrasena = null
  pin: any
  cajainterna=0
  ngOnInit() {
    this.nombre = this.activate.snapshot.paramMap.get('nombre')
    this.email = this.activate.snapshot.paramMap.get('email')
    this.telefono = this.activate.snapshot.paramMap.get('telefono')
    this.contrasena = this.activate.snapshot.paramMap.get('contrasena')
  }
  //crear usuario
  crear() {
    let load = this.presentLoading();
    this.fcm.getToken().then(token => {
      this.au.crear(this.email,this.contrasena,this.pin,this.nombre,this.telefono,this.cajainterna,token).then(res => {
        this.au.creocorrecto();
        load.then(loading => {
          loading.dismiss()
        })
        this.route.navigate(['/indexconfirmacion']);
      }).catch(err => {
        this.au.ingresoinvalido()
        load.then(loading => {
          loading.dismiss()
        })
      });
    })
  }
  async presentLoading() {
    const loading = await this.loadingController.create({
      message: "Guardando"
    });
    await loading.present();
    return loading
  }

}
