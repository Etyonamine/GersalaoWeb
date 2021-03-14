import { Cliente } from './../cliente';
import { HttpClient,HttpParams } from '@angular/common/http';
import { Component,Inject, OnInit } from '@angular/core';
import { ActivatedRoute,Router}from '@angular/router';
import { FormGroup, FormControl}from '@angular/forms';




@Component({
  selector: 'app-cliente-edit',
  templateUrl: './cliente-edit.component.html',
  styleUrls: ['./cliente-edit.component.css']
})
export class ClienteEditComponent implements OnInit {
  title:string;
  
  form:FormGroup;
  cliente:Cliente;
  public aniversarioformatado:Date;
  public anoCorrente: number = (new Date()).getFullYear();

  constructor(
    private activatedRoute:ActivatedRoute,
    private router: Router,
    private http:HttpClient
  ) { }
 

  ngOnInit(): void {
    this.form=new FormGroup({
      nome:new FormControl(' '),
      aniversario:new FormControl(' ')  
    });
    this.loadData();
  }

  loadData(){
    //retornando o codigo do codigo parametro
    var codigo =+this.activatedRoute.snapshot.paramMap.get('codigo');

    var url ='https://localhost:44314/api/clientes/' + codigo;
    
    this.http.get<Cliente>(url)
          .subscribe(result=>
                      {
                         this.cliente = result;
                         this.aniversarioformatado =(result.aniversario)?new Date(result.aniversario):null;
                         this.title="Editar - " + this.cliente.nome;
                         this.form.patchValue(this.cliente);
                         console.log (this.aniversarioformatado);
                      },error=>console.error(error));    
    
  }

  onSubmit(){
    var dataNiver:string = this.form.get("aniversario").value;
    var cliente = this.cliente;
    cliente.nome = this.form.get("nome").value; 

    if (dataNiver !== '')  {
      cliente.aniversario = new Date(dataNiver);
    }else{
      cliente.aniversario= null;
    }
    
    

    var url ='https://localhost:44314/api/clientes/' + this.cliente.codigo;

    this.http.put<Cliente>(url,cliente)
            .subscribe(result=>
              {
                console.log("Cliente" + cliente.codigo + " atualizado com sucesso!");

                this.router.navigate(['/cliente'])
              },error=>console.log(error));
  }

}
