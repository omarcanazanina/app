import { Component, OnInit ,ViewChild} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../servicios/auth.service';
import { AlertController, IonContent } from '@ionic/angular';
import { AngularFirestore } from 'angularfire2/firestore';
import { ModalController } from '@ionic/angular'
import { DetalleenviocobroPage } from '../detalleenviocobro/detalleenviocobro.page'
import { UsuarioComponent } from '../componentes/usuario/usuario.component';
import { Content } from '@angular/compiler/src/render3/r3_ast';

@Component({
  selector: 'app-pagarenviocobro',
  templateUrl: './pagarenviocobro.page.html',
  styleUrls: ['./pagarenviocobro.page.scss'],
})
export class PagarenviocobroPage implements OnInit {
  idcobro = null;
  uu: any
  cobro: any = []
  usuario = {
    nombre: "",
    cajainterna: "",
    uid: "",
    password: "",
    telefono: "",
  }
  idcobrador: any
  cobrador: any = []
  cajaactual: number
  cajaactual1: any
  fecha: Date
  fechita: any
  cajainterna: number
  cajainterna1: any
  prueba1: any = []
  cobros: any = []
  recupera: any = []
  actual: any = []
  trans: any = []
  unidos: any[]

  numero = null
  caja: number
  caja1: any
  @ViewChild("content",{static:true}) content: IonContent
  constructor(private activatedRoute: ActivatedRoute,
    private au: AuthService,
    public alertController: AlertController,
    public fire: AngularFirestore,
    public router: Router,
    public modal: ModalController) {
     
     }
    callFunction(){
      
        this.content.scrollToBottom (0); 
       
    }
  ngOnInit() {
    this.numero = this.activatedRoute.snapshot.paramMap.get('id')
    this.au.verificausuarioActivo(this.numero).subscribe(cont => {
      this.cobrador = cont[0]

      this.uu = this.au.pruebita();
      this.au.recuperaundato(this.uu).subscribe(usuario => {
        this.usuario = usuario;
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
          this.actual = this.au.ordenarjson(this.unidos, 'fecha', 'asc')
          console.log(this.actual);
        })
      })

    })
    this.fecha = new Date();
    const mes = this.fecha.getMonth() + 1;
    this.fechita = this.fecha.getDate() + "-" + mes + "-" + this.fecha.getFullYear() + " " + this.fecha.getHours() + ":" + this.fecha.getMinutes() + ":" + this.fecha.getSeconds();

    /*this.au.recuperaundato(this.idcobro).subscribe(datos => {
      this.cobrador = datos;
    })*/
  }

  async pagar(usu) {

    if (parseFloat(this.usuario.cajainterna) >= parseFloat(usu.monto)) {
      const alert = await this.alertController.create({
        header: 'Monto es' + ' ' + usu.monto + ' ' + 'Bs.',
        subHeader: 'Ingrese su codigo',
        inputs: [
          {
            name: 'codigo',
            type: 'text',
            placeholder: 'Codigo de seguridad'
          },
        ],
        buttons: [
          {
            text: 'Cancel',
            role: 'cancel',
            cssClass: 'secondary',
            handler: () => {
              console.log('Confirm Cancel');
            }
          }, {
            text: 'Confirmar',
            handler: data => {
              this.au.recuperaenviocobros(this.usuario.uid, this.cobrador.uid, usu.fechita).subscribe(dat => {
                let prueba11 = dat[0]
                this.au.agregafechapagocobros({ fechapago: this.fechita }, this.uu, usu.id)
                this.au.agregafechapagocobros({ fechapago: this.fechita }, this.cobrador.uid, prueba11.id)
                this.au.actualizaestadodecobro({ estado: 1 }, this.cobrador.uid, prueba11.id)
              })
              if (data.codigo == this.usuario.password) {
                this.cajaactual = parseFloat(this.usuario.cajainterna) - parseFloat(usu.monto);
                this.cajaactual1 = this.cajaactual.toFixed(2)
                this.au.actualizacaja({ cajainterna: this.cajaactual1 }, this.usuario.uid);
                this.au.actualizaestadodecobro({ estado: 1 }, this.usuario.uid, usu.id)
                this.fire.collection('/user/' + this.usuario.uid + '/egreso').add({
                  monto: usu.monto,
                  id: this.cobrador.uid,
                  nombre: this.cobrador.nombre,
                  telefono: this.cobrador.telefono,
                  fechita: this.fechita,
                  fecha: this.fecha,
                  descripcion: 'pago por envio de cobro',
                  saldo: this.cajaactual1,
                  identificador: '0'
                })
                this.cajainterna = parseFloat(this.cobrador.cajainterna) + parseFloat(usu.monto);
                this.cajainterna1 = this.cajainterna.toFixed(2)
                this.au.actualizacaja({ cajainterna: this.cajainterna }, this.cobrador.uid)
                this.fire.collection('/user/' + this.cobrador.uid + '/ingresos').add({
                  monto: usu.monto,
                  id: this.usuario.uid,
                  nombre: this.usuario.nombre,
                  telefono: this.usuario.telefono,
                  fechita: this.fechita,
                  fecha: this.fecha,
                  descripcion: 'recibio por envio de cobro',
                  saldo: this.cajainterna1,
                  identificador: '1'
                })
                this.au.pagodecobroexitoso(usu.monto, this.cobrador.nombre);
                this.router.navigate(['/transferencias'])
              } else {
                this.au.passincorrecta();
              }
            }
          }
        ]
      });
      await alert.present();
    } else {
      this.au.insuficiente();
    }
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
  //a prueba
  enviacobro(cobrador) {
    this.router.navigate(['/enviacobro', this.cobrador.uid])
  }
  //
  transferencia(cobrador) {
    this.modal.create({
      component: UsuarioComponent,
      cssClass: 'my-custom-modal-css',
      componentProps: {
        usu: cobrador
      }
    }).then((modal) => modal.present())
  }
}
