import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-telefono',
  templateUrl: './telefono.page.html',
  styleUrls: ['./telefono.page.scss'],
})


export class TelefonoPage implements OnInit {

  constructor(private router:Router,private activate:ActivatedRoute) { }
  telefono:any
  nombre=null
  email=null
  ngOnInit() {
    this.nombre=this.activate.snapshot.paramMap.get('nombre')
    this.email=this.activate.snapshot.paramMap.get('email')
  }
  guardarphone(){
    alert(this.telefono)
    this.router.navigate(["/password",this.nombre,this.email,this.telefono])
  }

}
