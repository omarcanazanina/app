import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-modpin',
  templateUrl: './modpin.page.html',
  styleUrls: ['./modpin.page.scss'],
})


export class ModpinPage implements OnInit {
  usuario
  pin
  password
  constructor(private activatedRoute: ActivatedRoute,) { }

  ngOnInit() {
    this.usuario = this.activatedRoute.snapshot.params
  }

  modificarPin(){
    console.log(this.usuario.password);
    if(this.password==this.usuario.pass){
      if(this.pin==this.usuario.password){
        console.log("true");
      }
      else{
        console.log("false");
      }
    }else{

    }
  }

}
