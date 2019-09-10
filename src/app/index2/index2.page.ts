import { Component, OnInit, ViewChild } from '@angular/core';
import { AlertController, NavController, LoadingController } from '@ionic/angular';
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
    private loadingController:LoadingController,
    private fcm:FCM,
    private router: Router,
    private loadingController:LoadingController
  ) { }
  @ViewChild('focus',{static:true}) myInput;
  correo: string;
  pass: string;
  password_type: string = 'password';


  login() {

    let load=this.presentLoading()
    this.fauth.login(this.correo, this.pass).then(res => {
      console.log(JSON.stringify(res.user.uid))
      this.fcm.getToken().then(t=>{
        this.fauth.actualizatoken({token:t},res.user.uid).then(()=>{
          load.then(loading => {
            loading.dismiss()
          })
          this.router.navigate(['/indexconfirmacion']);
          loading.then(l=>{
            l.dismiss()
          })
        }).catch(error=>{
        
        })
      }).catch(err=>{
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
  async presentLoading() {
    const loading = await this.loadingController.create({
      message: 'Verificando...!'
    });
    await loading.present();
    return loading
  }
}
