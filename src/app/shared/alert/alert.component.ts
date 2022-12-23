import { Component, Inject, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-alert',
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.scss']
})
export class AlertComponent implements OnInit {

  mensagem: string = "Pizza";

  constructor() {
    
  }

  ngOnInit(): void {
  }


}
