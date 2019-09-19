import { Component } from '@angular/core';
import {FCM} from '@ionic-native/fcm/ngx'
import { Router } from '@angular/router';
import { LocalNotifications } from '@ionic-native/local-notifications/ngx';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html'
})
export class AppComponent {
  encodeData: any;
  scannedData: {};

  constructor(
    private route:Router,
    private local:LocalNotifications,
    private fcm:FCM,
    private alertController:AlertController
  ) {
    this.initializeApp();
  }


  
  initializeApp() {
    this.fcm.subscribeToTopic('marketing');

  this.fcm.onNotification().subscribe(data => {
    if(data.wasTapped){
      console.log("Received in background");
      this.route.navigate(data.landing_page)
    } else {
      
      this.presentAlertConfirm(data.omar,data.jaime,data.landing_page)
      this.notificaciones(data.omar,data.jaime,data.landing_page)
     // alert(data.omar+" "+data.jaime+" "+data.landing_page)
      //this.route.navigate(data.landing_page)
    };
  });

  this.fcm.unsubscribeFromTopic('marketing');
    }

    async presentAlertConfirm(t,m,ruta) {
      const alert = await this.alertController.create({
        header: t,
        message: m,
        buttons: [
           {
            text: 'Aceptar',
            handler: () => {
              this.route.navigate(ruta)
            }
          }
        ]
      });
    
      await alert.present();
    }

    notificaciones(t,m,ruta){
      this.local.schedule({
        id: 1,
        title: t,
        text: m,
        vibrate: true
      });

    }

}
