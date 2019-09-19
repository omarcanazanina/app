import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AlertController } from '@ionic/angular';
import { Router } from '@angular/router';
@Component({
  selector: 'app-recoverpass',
  templateUrl: './recoverpass.page.html',
  styleUrls: ['./recoverpass.page.scss'],
})
export class RecoverpassPage implements OnInit {
  correorecover
  constructor(private db:AngularFireAuth,
    private router:Router,
    private alertController:AlertController) { 

  }

  ngOnInit() {
  }


  sendMessage(){
    console.log(this.correorecover)
    return this.db.auth.sendPasswordResetEmail(this.correorecover)
      .then(() => this.presentAlertConfirm('Envio exitoso','Enviamos un mensaje a tu correo electrónico para que puedas restablecer tu <strong>Contraseña</strong>!!!'))
      .catch((error) => 
      this.presentAlertConfirm('Envio erroneo','El correo <strong>'+ this.correorecover +'</strong> no pertenece a ningun usuario!!!')
      )
    }

    async presentAlertConfirm(header,body) {
      const alert = await this.alertController.create({
        header: header,
        message: body,
        buttons: [
          {
            text: 'Ingresar otro correo',
            role: 'cancel',
            cssClass: 'secondary',
            handler: () => {
              console.log('Confirm Cancel: blah');
            }
          },
         {
            text: 'Ok',
            handler: () => {
              this.router.navigate(['/index2']);
            }
          }
        ]
      });
      return await alert.present();
    }
}
