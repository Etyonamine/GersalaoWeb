import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/auth-guard/auth.service';
import { BaseFormComponent } from 'src/app/shared/base-form/base-form.component';
import { Compra } from '../compra';

@Component({
  selector: 'app-compra-edit',
  templateUrl: './compra-edit.component.html',
  styleUrls: ['./compra-edit.component.scss']
})
export class CompraEditComponent  extends BaseFormComponent implements OnInit {
  compra: Compra;
  formulario: FormGroup;
  codigo: number;
  tituloPagina:string;
  habilitaApagar:boolean;
  
  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router
  ) 
  {
    super();
  }

  ngOnInit(): void {
    this.compra = this.route.snapshot.data['compra']=== undefined?{}:this.route.snapshot.data['compra'];
    this.criacaoFormulario();

  }
  criacaoFormulario(){
    //formulario cliente
    this.formulario = this.formBuilder.group({
      codigo: [null],
      dataCompra: [null, [Validators.required, Validators.pattern('^([0]?[1-9]|[1|2][0-9]|[3][0|1])[./-]([0]?[1-9]|[1][0-2])[./-]([0-9]{4})$')]],
      valor:[null,[Validators.required, Validators.min(0),Validators.max(9999)]],
      dataVenctoBoleto:[null,[Validators.required, Validators.pattern('^([0]?[1-9]|[1|2][0-9]|[3][0|1])[./-]([0]?[1-9]|[1][0-2])[./-]([0-9]{4})$')]],
      dataPagtoBoleto:[null,[Validators.pattern('^([0]?[1-9]|[1|2][0-9]|[3][0|1])[./-]([0]?[1-9]|[1][0-2])[./-]([0-9]{4})$')]],
      observacao:[null]
    });
  }
 
  submit() {
    throw new Error('Method not implemented.');
  }
  openDialogFormaPagto(){

  }
  openConfirmExclusao(){

  }
  retornar()
  {
    
  }
}
