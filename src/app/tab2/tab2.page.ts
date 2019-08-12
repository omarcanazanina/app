import { Component  } from '@angular/core';
import { BarcodeScanner, BarcodeScannerOptions } from '@ionic-native/barcode-scanner/ngx';
import { Router } from '@angular/router';
import { AuthService } from '../servicios/auth.service';
import { AngularFirestore } from 'angularfire2/firestore';
import { ModalController } from '@ionic/angular';

import { DetalleenviocobroPage } from '../detalleenviocobro/detalleenviocobro.page'
import { UsuarioComponent } from '../componentes/usuario/usuario.component';
@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})

export class Tab2Page {

  public data = {
    text: ""
  };
  option: BarcodeScannerOptions;
  constructor(public bar: BarcodeScanner,
    private route: Router,
    private au: AuthService,
    private tan: AngularFirestore,

    public modal: ModalController) {
  }
  correo: string;
  usuario = {
    cajainterna: "",
    correo: "",
    monto: "",
    nombre: "",
    uid: ""
  }
  uu: any;
  lista: any;
  caja: number
  caja1: any

  numero = '70434823'
  cobrador: any = []
  trans: any = []
  recupera: any = []
  unidos: any = []
  actual: any = []

  enviado="pahUgczvXXdLWJ9h701g2XLIYvw1"
  ngOnInit() {

    this.uu = this.au.pruebita();

    this.au.recuperaundato(this.uu).subscribe(usuario => {
      this.usuario = usuario;
      console.log("logueado" + this.usuario.uid);
      this.caja = parseFloat(this.usuario.cajainterna)
      this.caja1 = this.caja.toFixed(2)
    })
   /* 
    this.au.verificausuarioActivo(this.numero).subscribe(cont => {
      this.cobrador = cont[0]
      console.log("cobrador" + this.cobrador.uid);

      this.uu = this.au.pruebita();

      this.au.recuperaundato(this.uu).subscribe(usuario => {
        this.usuario = usuario;
        console.log("logueado" + this.usuario.uid);
        this.caja = parseFloat(this.usuario.cajainterna)
        this.caja1 = this.caja.toFixed(2)

        this.au.recuperatransferencias(this.cobrador.uid, this.usuario.uid).subscribe(dat => {
          this.trans = dat
          console.log(this.trans);
        })
        this.au.recuperacobros(this.cobrador.uid, this.uu).subscribe(datito => {
          this.recupera = datito
          console.log(this.recupera);
          this.unidos = [].concat(this.recupera, this.trans)
          this.actual = this.au.ordenarjson(this.unidos, 'fecha', 'desc')
          console.log(this.actual);
        })
      })

    })
    */
  }
  opendetalle(usu) {
    this.modal.create({
      component: DetalleenviocobroPage,
      cssClass: 'detalleenviocobro',
      componentProps: {
        usu: usu
      }
    }).then((modal) => modal.present())
  }
  

  scan() {
    this.option = {
      prompt: "por favor lea el codigo QR"
    }
    this.bar.scan(this.option).then(barcodeData => {
      this.data = barcodeData;
      const convertido = this.data.text.split("/");
      const convertido1 = convertido[0];
      const convertido2 = convertido[1];
      var c = 0;
      var letra = "/"
      for (var i = 0; i <= this.data.text.length; i++) {
        if (this.data.text[i] == letra) {
          c++
        }
      }
      if (c == 0) {
        this.route.navigate(['/cards', this.data.text])
      } else {
        this.route.navigate(['/escaner', convertido1, convertido2])
      }
    }).catch(err => {
      console.log('Error', err);
    });
  }

  historial() {
    this.route.navigate(['/ingresoegreso'])
  }
 


}






