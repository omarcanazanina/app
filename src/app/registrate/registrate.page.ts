import { Component, OnInit, ViewChild } from '@angular/core';
import { AlertController, LoadingController } from '@ionic/angular';
import { AuthService } from '../servicios/auth.service'
import { Router } from '@angular/router'
import { GooglePlus } from '@ionic-native/google-plus/ngx';
import { FCM } from '@ionic-native/fcm/ngx';
import { AngularFireAuth } from '@angular/fire/auth';

@Component({
  selector: 'app-registrate',
  templateUrl: './registrate.page.html',
  styleUrls: ['./registrate.page.scss'],
})
export class RegistratePage implements OnInit {
  miModelo: any
  ultima: string
  la: number
  pin: number
  ultimapin: string
  cajabancaria
  constructor(private alertc: AlertController,
    private au: AuthService, private route: Router,
    private loadingController: LoadingController,
    private googlePlus:GooglePlus,
    private fire:AngularFireAuth,
    private alertController:AlertController,
    private fcm: FCM
  ) {
    this.miModelo = {};

  }
  @ViewChild('focus',{static:true}) myInput;
  cajainterna: number = 0;
  crear() {
    let load = this.presentLoading();
    this.la = parseInt(this.miModelo.solonumero);
    this.ultima = this.la.toString();
    this.pin = parseInt(this.miModelo.solonumero1);
    this.ultimapin = this.pin.toString();
    const ja = this.miModelo.campo.indexOf("/")
    if (this.miModelo.soloTexto == undefined || this.miModelo.campo == undefined || this.miModelo.contrasena == undefined || this.miModelo.confirmContrasena == undefined || this.miModelo.solonumero == undefined || this.miModelo.solonumero1 == undefined) {
      console.log("todo esta vacio");

      this.au.revisedatos()
      load.then(loading => {
        loading.dismiss()
      })
    } else {
      if (ja >= 0) {
        console.log("del correo");
        this.au.correoinvalido()
        load.then(loading => {
          loading.dismiss()
        })
      } else {
        if (this.miModelo.solonumero.length != this.ultima.length || this.ultima.length != 8) {
          this.au.telefonoinvalido()
          load.then(loading => {
            loading.dismiss()
          })
        } else {
          if (this.miModelo.contrasena != this.miModelo.confirmContrasena) {
            this.au.contraseñainvalida()
            load.then(loading => {
              loading.dismiss()
            })
          } else {
            if (this.miModelo.solonumero1.length != this.ultimapin.length || this.ultimapin.length != 4 || this.ultimapin.indexOf("-") >= 0) {
              this.au.pininvalido()
              load.then(loading => {
                loading.dismiss()
              })
            } else {
              this.fcm.getToken().then(token => {
                this.au.crear(this.miModelo.campo, this.miModelo.contrasena, this.miModelo.confirmContrasena, this.miModelo.solonumero1, this.miModelo.soloTexto, this.miModelo.solonumero, this.cajainterna, token).then(res => {
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
          }
          }
        }
      }
    }
    ngOnInit() {
      setTimeout(() => {
        this.myInput.setFocus();
      }, 150)
    }
    async presentLoading() {
      const loading = await this.loadingController.create({
        message: "Guardando"
      });
      await loading.present();
      return loading
    }

    //FUNCIONES DE LOGUEO PON GOOGLE
    async doGoogleLogin(){
      const loading = await this.loadingController.create({
        message: 'Espera porfavor...'
      });
      this.presentLoadin(loading);
      this.googlePlus.login({
        'scopes': '', // optional - space-separated list of scopes, If not included or empty, defaults to `profile` and `email`.
        'webClientId': "558881935841-6u48b95j7jehggjblbt7kdm93srvchce.apps.googleusercontent.com", // optional - clientId of your Web application from Credentials settings of your project - On Android, this MUST be included to get an idToken. On iOS, it is not required.
        'offline': true, // Optional, but requires the webClientId - if set to true the plugin will also return a serverAuthCode, which can be used to grant offline access to a non-Google server
        })
        .then(user => {
          //save user data on the native storage
          alert(JSON.stringify(user))
          alert(JSON.stringify(user.displayName))
          alert(JSON.stringify (user.email))
          loading.dismiss();
          this.route.navigate(['/telefono',user.displayName,user.email])
        }, err => {
          alert(JSON.stringify(err))
          loading.dismiss();
        })
    }
  
    async presentAlert() {
      const alert = await this.alertController.create({
         message: 'Cordova is not available on desktop. Please try this in a real device or in an emulator.',
         buttons: ['OK']
       });
  
      await alert.present();
    }
  
  
    async presentLoadin(loading) {
      return await loading.present();
    }

  }
