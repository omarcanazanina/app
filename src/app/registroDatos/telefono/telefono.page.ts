import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-telefono',
  templateUrl: './telefono.page.html',
  styleUrls: ['./telefono.page.scss'],
})
export class TelefonoPage implements OnInit {

  constructor(private router:Router) { }

  ngOnInit() {
  }
  guardarphone(){
    this.router.navigate(["/password"])
  }

}
