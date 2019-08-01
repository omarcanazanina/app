import { Component } from '@angular/core';
import {FCM} from '@ionic-native/fcm/ngx'
import { Router } from '@angular/router';
import { LocalNotifications } from '@ionic-native/local-notifications/ngx';

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
    private fcm:FCM
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
      alert("lo que sea")
      this.local.schedule({
        id: 1,
        title: data.title,
        text: data.body,
        sound: 'default',
        foreground:true,
        data: { secret: data.idusu }
      });
      console.log("Received in foreground");
      this.route.navigate(data.landing_page)
    };
  });

  this.fcm.unsubscribeFromTopic('marketing');
    }

}
