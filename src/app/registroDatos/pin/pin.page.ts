import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-pin',
  templateUrl: './pin.page.html',
  styleUrls: ['./pin.page.scss'],
})
export class PinPage implements OnInit {
  public mask = [/[0-9]/, /\d/, /\d/, /\d/]
  constructor() { }

  ngOnInit() {
  }

}
