import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule } from '@angular/forms';
import { DateAdapter } from '@angular/material/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { now } from 'moment';
import { BaseFormComponent } from 'src/app/shared/base-form/base-form.component';

interface  dataPagtoBaixa{
  dataFechto : Date;
  dataCadastro: Date;
}



@Component({
  selector: 'app-pedido-baixa-pagto',
  templateUrl: './pedido-baixa-pagto.component.html',
  styleUrls: ['./pedido-baixa-pagto.component.scss']
})
export class PedidoBaixaPagtoComponent extends BaseFormComponent implements OnInit {
  submit() {
    return this.formulario.get('dataPagtoCliente').value;
  }

  formulario: FormGroup;
  dataFechamento : Date;
  dataPedido: Date;
  dataHoje : Date;

  constructor(
              public dialogRef: MatDialogRef<PedidoBaixaPagtoComponent>,
              @Inject(MAT_DIALOG_DATA) public data: dataPagtoBaixa,
              private formBuilder: FormBuilder) {
                super();
               }
  
  ngOnInit(): void {
    this.dataFechamento = this.data.dataFechto;
    this.dataPedido = this.data.dataCadastro;
    this.dataHoje = new Date(now());
    this.criacaoFormulario();
  }

  criacaoFormulario(){ 
    this.formulario = this.formBuilder.group({
      dataPagtoCliente: [this.dataFechamento]         
    });
  }
  onNoClick(): void {
    this.dialogRef.close();
  }
}
