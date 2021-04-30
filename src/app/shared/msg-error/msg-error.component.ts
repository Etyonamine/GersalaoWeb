import { FormControl } from '@angular/forms';
import { FormValidations } from './../service/form-validations';
import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-msg-error',
  templateUrl: './msg-error.component.html',
  styleUrls: ['./msg-error.component.scss']
})
export class MsgErrorComponent implements OnInit {

  @Input() mostrarErro: boolean;
  @Input() mensagemErro: string;

  constructor() { }



  ngOnInit(): void {
  }
 
}
