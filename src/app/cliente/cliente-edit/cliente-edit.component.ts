import { EnderecoServiceService } from './../../endereco/endereco-service.service';
import { ClienteEndereco } from './../../cliente-endereco/cliente-endereco';
import { ClienteEnderecoService } from './../../cliente-endereco.service';
import { MunicipioService } from './../../municipios/municipioService';
import { UnidadeFederativaService } from './../../unidade-federativa/unidade-federativa-service';
import { MatTableDataSource } from '@angular/material/table';
import { UnidadeFederativa } from './../../unidade-federativa/unidade-federativa';
import { HttpClient, HttpParams } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Cliente } from './../cliente';
import { Component, NgModule } from '@angular/core';
import { ActivatedRoute,Router}from '@angular/router';
import { FormGroup,FormControl,Validators,AbstractControl, AsyncValidatorFn } from '@angular/forms';
import { BaseFormComponent } from './../../base.form.component';
import { ClienteService } from "./../cliente.service";
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiResult } from 'src/app/base.service';
import { Municipio } from 'src/app/municipios/municipio';
import { Endereco } from 'src/app/endereco/endereco';

@Component({
  selector: 'app-cliente-edit',
  templateUrl: './cliente-edit.component.html',
  styleUrls: ['./cliente-edit.component.css']
})



export class ClienteEditComponent extends BaseFormComponent {
  http: any;

  constructor(
    private activatedRoute:ActivatedRoute,
    private router: Router,    
    private clienteService:ClienteService,
    private clienteEnderecoService:ClienteEnderecoService,
    private enderecoService:EnderecoServiceService,
    private unidadeFederativaService: UnidadeFederativaService,
    private municipioService : MunicipioService,    
    private snackBar : MatSnackBar ,
    http:HttpClient
     
  ) { 
    super();
  }
  
 //**** variaveis e demais objetos utilizados na pagina*/
  title:string;
  
  form:FormGroup;
  cliente:Cliente;
  clienteEndereco: ClienteEndereco[];
  oEndereco:Endereco;
  
  unidadeFederativas : UnidadeFederativa[];
  municipios: Municipio[];
  municipio : Municipio;

  public aniversarioformatado:Date;
  public anoCorrente: number = (new Date()).getFullYear();
  public optionSituacao:Array<Object>=[{value:1,name:"Ativo"},{value:2,name:"Inativo"}];
  cod_unida_fed :number;
  public cod_endereco:number;
  cod_munic : number;
  defaultFilterColumn_UF: string= "descricao";
  filterQuery_UF:string=null;

  situacao:number = 0;
    

  codigo?:number;
  durationInSeconds: number;
  private message:string;

  ngOnInit(): void {
    this.oEndereco = <Endereco>{};

    // **** elementos do formulario
    this.form = new FormGroup({
      codigoV:new FormControl(''),
      nome: new FormControl('', Validators.required),
      aniversario:new FormControl('') ,
      statusId:new FormControl('',Validators.required),
      endereco:new FormControl(''),
      numero:new FormControl(''),
      bairro:new FormControl(''),
      complemento:new FormControl(''),
      cep:new FormControl(''),
      codigoUF: new FormControl('')      ,
      codigoMunicipio:new FormControl('') ,
      cod_endereco_hdf:new FormControl('')
    },null, this.isDupeCliente());
    this.loadData();
  }

  //**** Carregamento das informações na tela */
  loadData(){
    //carregar a lsita de estados
    this.listaUnidadeFederativa();
  
    //retornando o codigo do codigo parametro
    this.codigo = +this.activatedRoute.snapshot.paramMap.get('codigo');
    //EDIT MODE
    if (this.codigo) {
          
      //fetch the city from the server
      this.clienteService.get<Cliente>(this.codigo)
            .subscribe(result => {
                        this.cliente = result;
                        this.title = "Alteração de registro";

        
        this.aniversarioformatado = this.cliente.aniversario;
        this.situacao = this.cliente.codigosituacao;
       
        //update the form with the city value
        this.form.patchValue(this.cliente);      
        this.form.get('statusId').setValue(this.cliente.codigosituacao);
        this.form.get('codigoV').setValue(this.cliente.codigo);

      },error=>{
        console.error(error);

      });
      this.listaEnderecos();
    }
    else 
    {
      //Adicionar
      this.title = "Novo registro";
    }    
    
  }

//**** funcao de gravação */
  onSubmit(){
 
    //verificando se é um caso de ediçao ou novo registro
    var cliente = (this.codigo)?this.cliente:<Cliente>{};
    
    var bln_gravado:boolean;

    //preenchendo o objeto *** CLIENTE *******
    //Nome
    cliente.nome = this.form.get("nome").value;     
    cliente.codigosituacao = this.form.get('statusId').value;

    //Aniversario - tratamento para o atributo aniversario
    var dataNiver:string = this.form.get("aniversario").value;
    if (dataNiver !== '')  {
      cliente.aniversario = new Date(dataNiver);
    }else{
      cliente.aniversario= null;
    }
    
    
    
    // *** PREENCHENO O ENDERECO ************ 
    //residencial
    this.oEndereco.codigoTipoEndereco = 1;
    this.oEndereco.codigoSituacao=1;
    this.oEndereco.codigoUsuarioCadastrado = 1;
    this.oEndereco.dataCadastro = new Date();

    this.oEndereco.descricao = this.form.get("endereco").value;
    this.oEndereco.numero =this.form.get('numero').value;
    this.oEndereco.complemento = this.form.get('complemento').value;
    this.oEndereco.cep = this.form.get('cep').value;
    this.oEndereco.bairro = this.form.get('bairro').value;
    this.oEndereco.codigoMunicipio =  (this.cod_munic > 0)?this.cod_munic:null;
    
    //Determinando o fluxo do processamento (edição ou novo registro)
    if (this.codigo){
      //edição
      this.clienteService.put<Cliente>(cliente)
        .subscribe(result=>{
          bln_gravado= true;

        },
        error=>{
          this.message = "Ocorreu um erro na tentativa de atualizar os dados basicos do Cliente.";           
          this.exibirMensagem(error,error);
          bln_gravado= false;

        });

      this.enderecoService.put<Endereco>(this.oEndereco)
          .subscribe(result=>{
            bln_gravado=true;
          },
          error=>{
            this.message = "Ocorreu um erro na tentativa de atualizar o endereco do Cliente.";           
          this.exibirMensagem(error,error);
            bln_gravado= false;
          })

      
    this.message="Cliente código:" + cliente.codigo + " atualizado com sucesso!";
    this.exibirMensagem(this.message,this.message);
    this.router.navigate(['/cliente']);
  
    }
    else{
      this.message ="Cliente cadastrado com sucesso!";
      this.oEndereco.codigo=0;

      cliente.codigousuariocadastro = 1;

       //novo registro
       //cliente
      this.clienteService
        .post<Cliente>(cliente)
        .subscribe(result=>
        {  
          
        },error=>
        {
          this.message="Ocorreu um erro na tentativa de cadastrar um novo Cliente.";
          this.exibirMensagem(error,this.message);
        });

        //endereco
        this.enderecoService
            .post<Endereco>(this.oEndereco)
            .subscribe(result=>{},error=>{
              this.message="Ocorreu um erro na tentativa de cadastrar um novo Cliente.";
              this.exibirMensagem(error,this.message);
            });

        this.exibirMensagem(this.message,this.message);
        this.router.navigate(['/cliente']);
    }   
  }
  
  //**** função de exclusao */
  onDelete(){
    if (confirm('Tem certeza que deseja apagar este registro?')){
      this.message ="Cliente com o código: " + this.cliente.codigo + " apagado com sucesso!";
       this.clienteService.delete<Cliente>(this.cliente.codigo)
           .subscribe(result=>
            {
              this.exibirMensagem(this.message,this.message);              
              this.router.navigate(['/cliente']);

            },error=>{
              this.message="Atenção!Ocorreu um erro na tentativa de apagar o registro!";              
              this.exibirMensagem(error, this.message);
            });
    }    
  }

  exibirMensagem(error:any, mensagem:string){        
    console.log(error);
    this.snackBar.open(this.message,'',{duration:3000,verticalPosition:'top',horizontalPosition:'center'});
  }
 
  isDupeCliente():AsyncValidatorFn{
    
      return (control:AbstractControl):Observable<{[key:string]:any } |null> =>
      {
        
        //verificando se é um caso de ediçao ou novo registro
        var clienteValidar = (this.codigo)?this.cliente:<Cliente>{};
        
        clienteValidar.codigo = this.codigo;
        clienteValidar.nome = this.form.get('nome').value;

        return this.clienteService.isDupeCliente(clienteValidar).pipe(map(result => {
          return (result ? { isDupeCliente: true } : null);          
        }));
      }
  }

  //lista de estados
  listaUnidadeFederativa(){
    
    this.unidadeFederativaService.getData<ApiResult<UnidadeFederativa>>(
      0,
      30,
      "descricao",
      "ASC",
      null,
      null,
    ).subscribe(result => {
      this.unidadeFederativas = result.data;
    }, error => console.error(error));

  }
  onSelected_UF(codigo:any){
    this.listaMunicipio(codigo);
   }
  listaMunicipio(codigo:any){
      if (this.cod_unida_fed == null){
        this.cod_unida_fed = 0;
      }
      this.municipioService.getMunicipioPorUF<ApiResult<Municipio>>(
        this.cod_unida_fed,
        0,
        1000,
        "descricao",
        "ASC",
        "descricao",
        null,
      ).subscribe(result => {
        this.municipios = result.data;        
      }, error => console.error(error));
      
  }

  listaEnderecos()
  {    
    this.clienteEnderecoService.get(this.codigo)    
        .subscribe(result=>
                    {        
                        
                        this.dadosEndereco(result[0].codigoEndereco );
                    },error=>console.error(error));           
                        ;
  }

  dadosEndereco(codigo:number){
    this.enderecoService.get<Endereco>(codigo)
        .subscribe(result=>
          {
            this.oEndereco = (result)?result:<Endereco>{};
            this.cod_munic = result.codigoMunicipio;
            this.form.get('endereco').setValue(result.descricao);
            this.form.get('numero').setValue(result.numero);
            this.form.get('complemento').setValue(result.complemento);
            this.form.get('cep').setValue(result.cep);
            this.form.get('bairro').setValue(result.bairro);    
            this.selecionarEstadoMunicipio(this.cod_munic)                            ;
          });
  }

  selecionarEstadoMunicipio(codigoMunicipio:number){
    this.municipioService.get<Municipio>(codigoMunicipio)
        .subscribe(result=>{
          this.onSelected_UF(result.codigoUnidadeFederativa);
          this.cod_unida_fed = result.codigoUnidadeFederativa;          
          this.cod_munic = codigoMunicipio;
          this.listaMunicipio(codigoMunicipio);
        });
  }
  
}
 