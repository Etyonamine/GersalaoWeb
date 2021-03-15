import { Cliente } from './../cliente';
import { HttpClient,HttpParams } from '@angular/common/http';
import { Component,Inject, OnInit } from '@angular/core';
import { ActivatedRoute,Router}from '@angular/router';
import { FormGroup, FormControl,Validators }from '@angular/forms';
import { getMatFormFieldMissingControlError } from '@angular/material/form-field';
import { BaseFormComponent } from './../../base.form.component';
import { ClienteService } from "./../cliente.service";
import { ApiResult } from './../../base.service';


@Component({
  selector: 'app-cliente-edit',
  templateUrl: './cliente-edit.component.html',
  styleUrls: ['./cliente-edit.component.css']
})
export class ClienteEditComponent extends BaseFormComponent {
  title:string;
  
  form:FormGroup;
  cliente:Cliente;
  public aniversarioformatado:Date;
  public anoCorrente: number = (new Date()).getFullYear();
  codigo?:number;

  constructor(
    private activatedRoute:ActivatedRoute,
    private router: Router,    
    private clienteService:ClienteService
  ) { 
    super();
  }
 

  ngOnInit(): void {
    this.form=new FormGroup({
      nome:new FormControl('', Validators.required),
      aniversario:new FormControl('')  
    },null);
    this.loadData();
  }

  loadData(){
    
    //retornando o codigo do codigo parametro
    this.codigo = +this.activatedRoute.snapshot.paramMap.get('codigo');
    //EDIT MODE
    if (this.codigo) {
          
      //fetch the city from the server
      this.clienteService.get<Cliente>(this.codigo)
            .subscribe(result => {
                        this.cliente = result;
                        this.title = "Editar - " + this.cliente.nome;

        //update the form with the city value
        this.form.patchValue(this.cliente);
      }, error => console.error(error));
    } else {
      //Adicionar
      this.title = "Cadastro de uma novo cliente";
    }    
    
  }

  onSubmit(){

   
    //verificando se é um caso de ediçao ou novo registro
    var cliente = (this.codigo)?this.cliente:<Cliente>{};

    //preenchendo o objeto
    //Nome
    cliente.nome = this.form.get("nome").value; 

    //Aniversario - tratamento para o atributo aniversario
    var dataNiver:string = this.form.get("aniversario").value;
    if (dataNiver !== '')  {
      cliente.aniversario = new Date(dataNiver);
    }else{
      cliente.aniversario= null;
    }

    //codigo do usuario de cadastro
    if (!this.codigo){
      cliente.codigousuariocadastro = 1;
    }
    //Determinando o fluxo do processamento (edição ou novo registro)
    if (this.codigo){
      //edição
      this.clienteService.put<Cliente>(cliente)
        .subscribe(result=>{
          console.log("Cliente código:" + cliente.codigo + " atualizado com sucesso!");
          this.router.navigate(['/cliente']);
        },error=>console.log(error));
    }
    else{
      //novo registro
      this.clienteService
        .post<Cliente>(cliente)
        .subscribe(result=>{
          console.log("Cliente" + ' cadastrado com sucesso!');
          this.router.navigate(['/cliente']);
        })
    }   
  }
}

