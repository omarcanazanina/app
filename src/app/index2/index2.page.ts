import { Component, OnInit, ViewChild } from '@angular/core';
import { AlertController, NavController } from '@ionic/angular';
import { AuthService } from '../servicios/auth.service'
import { Router } from '@angular/router'
import { FCM } from '@ionic-native/fcm/ngx';

@Component({
  selector: 'app-index2',
  templateUrl: './index2.page.html',
  styleUrls: ['./index2.page.scss'],
})
export class Index2Page implements OnInit {
  constructor(public alertController: AlertController,
    private fauth: AuthService,
    private fcm:FCM,
    private router: Router,

  ) { }
  @ViewChild('focus',{static:true}) myInput;
  correo: string;
  pass: string;
  password_type: string = 'password';
  login() {
    this.fauth.login(this.correo, this.pass).then(res => {
      console.log(JSON.stringify(res.user.uid))
      this.fcm.getToken().then(t=>{
        alert(t)
        this.fauth.actualizatoken({token:t},res.user.uid).then(()=>{
          this.router.navigate(['/indexconfirmacion']);
        }).catch(error=>{
          alert(JSON.stringify("actualizar"+error))
        })
      }).catch(err=>{
        alert(JSON.stringify("refresh"+err))
      })
    }).catch(err => {
      this.fauth.ingresoinvalido()
    });
  }

  ngOnInit() {
    setTimeout(() => {
      this.myInput.setFocus();
    }, 150)
  }

  togglePasswordMode() {
    this.password_type = this.password_type === 'text' ? 'password' : 'text';
  }
}
