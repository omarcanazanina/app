import { Component, OnInit } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import * as firebase from 'firebase';
//import { firebaseConfig } from '../app.module';

@Component({
  selector: 'app-index',
  templateUrl: './index.page.html',
  styleUrls: ['./index.page.scss'],
})
 
export class IndexPage implements OnInit {
 // asd=firebase.initializeApp(firebaseConfig)
  cada= firebase.firestore();
usero=[{
  nombre:"",
  uid:"",
  monto:""
}]
aua:any

  constructor(public db: AngularFireDatabase) { }
  
  ngOnInit() {
    

   
    
    /*  //paso1
       const messaging = firebase.messaging();
      // messaging.usePublicVapidKey("BFGfC7hBeFgOirbQc-KrKD3REb4Px2yaNCmgOqDlDD5Y3XI4FGllmldZtENKsVB71T6btGY7I0CZF7ASPhD3JvM");
      //paso2
       messaging.requestPermission().then(function() {
         console.log('permiso de notificacion concedida.');
         return messaging.getToken();
   
       }).then(function(token){
         console.log(token);
         
       })
       .catch(function(err) {
         console.log('No se puede obtener permiso para notificar.',err);
       });
   */
  /*
       const usero=this.cada.collection("user")
       console.log(usero.orderBy("nombre"));
    */    

        
  }



}
