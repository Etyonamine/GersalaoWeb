import { ContatoService } from './../../contato/contato.service';
import { ClienteContatoService } from './../../cliente-contato/cliente-contato.service';
import { EnderecoServiceService } from './../../endereco/endereco-service.service';
import { ClienteEndereco } from './../../cliente-endereco/cliente-endereco';
import { ClienteEnderecoService } from './../../cliente-endereco.service';
import { MunicipioService } from './../../municipios/municipioService';
import { UnidadeFederativaService } from './../../unidade-federativa/unidade-federativa-service';
import { UnidadeFederativa } from './../../unidade-federativa/unidade-federativa';
import { HttpClient} from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Cliente } from './../cliente';
import { Component, TRANSLATIONS } from '@angular/core';
import { ActivatedRoute,Router}from '@angular/router';
import { FormGroup,FormControl,Validators,AbstractControl, AsyncValidatorFn, FormBuilder } from '@angular/forms';
import { BaseFormComponent } from './../../base.form.component';
import { ClienteService } from "./../cliente.service";
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiResult } from 'src/app/base.service';
import { Municipio } from 'src/app/municipios/municipio';
import { Endereco } from 'src/app/endereco/endereco';
import { ClienteContato } from 'src/app/cliente-contato/cliente-contato';
import { Contato } from 'src/app/contato/contato';
import { ContatoView } from 'src/app/contato/contatoView';



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
    private clienteContatoService:ClienteContatoService,
    private clienteEnderecoService:ClienteEnderecoService,
    private contatoService:ContatoService,
    private enderecoService:EnderecoServiceService,
    private unidadeFederativaService: UnidadeFederativaService,
    private municipioService : MunicipioService,    
    private snackBar : MatSnackBar ,
    private formBuilder:FormBuilder,    
    http:HttpClient
     
  ) { 
    super();
  }
  
 //**** variaveis e demais objetos utilizados na pagina*/
  title:string;
  
  form:FormGroup;
  cliente:Cliente;
  clienteContatoGravar:ClienteContato;
  clienteContatos: ClienteContato[]  ;  
  clienteEnderecos: ClienteEndereco[];
  clienteEndereco:ClienteEndereco;
  
  
  contato:Contato;
  contatos: Array<Contato>=[];
  contatoView:ContatoView;
 
  

  //documentos
  numeroRG;number;

  oEndereco:Endereco;
  
  unidadeFederativas : UnidadeFederativa[];
  municipios: Municipio[];
  municipio : Municipio;

  public aniversarioformatado:Date;
  public anoCorrente: number = (new Date()).getFullYear();
  public optionSituacao:Array<Object>=[{value:1,name:"Ativo"},{value:2,name:"Inativo"}];
  cod_unida_fed :number;
  cod_munic : number;
  public cod_endereco:number;
  
  defaultFilterColumn_UF: string= "descricao";
  filterQuery_UF:string=null;

  situacao:number = 0;
  codigoEstadoSelecionado:number;


  codigo?:number;
  durationInSeconds: number;
  private message:string;

  ngOnInit(): void {
    if (this.codigo==undefined){
      this.cliente = <Cliente>{};
    }
    this.oEndereco = <Endereco>{};
    this.clienteEndereco = <ClienteEndereco>{};
    this.clienteContatos = <ClienteContato[]>[];
    this.clienteContatoGravar = <ClienteContato>{};
    this.contato = <Contato>{};
    
    
    this.contatoView = <ContatoView>{};


     //**** elementos do formulario
     this.form = new FormGroup({
       codigoUnidadeFederativa:new FormControl(''),
       nome: new FormControl('', Validators.required),
       dataaniversario:new FormControl('') ,
       codigoSituacao:new FormControl('',Validators.required),
       descricao:new FormControl(''),
       numero:new FormControl(''),
       bairro:new FormControl(''),
       complemento:new FormControl(''),
       cep:new FormControl('',[ Validators.min(0), Validators.max(99999999),Validators.pattern(/^-?(0|[1-9]\d*)?$/)]),
       codigoUF: new FormControl('')      ,
       codigoMunicipio:new FormControl('') ,       
       email : new FormControl('',Validators.email),
       dddFixo:new FormControl(''),
       telefoneFixo:new FormControl('',[Validators.min(0), Validators.max(99999999),Validators.pattern(/^-?(0|[1-9]\d*)?$/)]),
       dddCel:new FormControl(''),
       celular:new FormControl('',[Validators.min(0), Validators.max(999999999),Validators.pattern(/^-?(0|[1-9]\d*)?$/)]),
       numeroRG:new FormControl(''),
       numeroCPF:new FormControl('')
     }, null, this.isDupeCliente());
   
   
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

        
        this.aniversarioformatado = this.cliente.dataaniversario;
        this.situacao = this.cliente.codigosituacao;        
         
        //update the form with the city value
        this.form.patchValue(this.cliente);      
        
        this.listaEnderecos();        
        this.listaClienteContato();
      },error=>{
        console.error(error);

      });
      
    }
    else 
    {
      //Adicionar
      this.title = "Novo registro";
    }    
    
  }

//**** funcao de gravação */
  onSubmit(){
        

    //preenchendo o objeto *** CLIENTE *******
    this.preencherObjetoCliente();

    //Determinando o fluxo do processamento (edição ou novo registro)
     if (this.codigo){
       //edição
      
        //** CLIENTE */
        this.clienteService.put<Cliente>(this.cliente)
          .subscribe(result=>{
            //** ENDERECO */
              this.enderecoService.put<Endereco>(this.oEndereco)
              .subscribe(result=>{
                      
                      //** CONTATO */
                      // *** PREENCHENO O CONTATO ************ 
                      var i:number=0;
                      for (i=0;i<=(this.clienteContatos.length-1);i++)
                      {
                        //preenchendo a descricao
                        this.clienteContatos[i].contato.descricao = this.valorContatos(this.clienteContatos[i].contato.codigoTipoContato);                      

                        //** atualizar registro */
                        this.atualizarContato(this.clienteContatos[i].contato); //telefone fixo
                      }

                      //** mensagem e redirecionamento */
                      this.message="Cliente código:" + this.codigo + " atualizado com sucesso!";
                      this.exibirMensagem(this.message,this.message);
                      this.router.navigate(['/cliente']);
              },
              error=>{
                this.message = "Ocorreu um erro na tentativa de atualizar o endereco do Cliente.";           
              this.exibirMensagem(error,error);
                
              });
          },
          error=>{
            this.message = "Ocorreu um erro na tentativa de atualizar os dados basicos do Cliente.";           
            this.exibirMensagem(error,error);
            
          });  
    }
    else{
      this.message ="Cliente cadastrado com sucesso!";
      this.oEndereco.codigo=0;
      this.oEndereco.dataCadastro = new Date();

      this.cliente.codigousuariocadastro = 1;

       //novo registro
       //cliente
      this.clienteService
        .post<Cliente>(this.cliente)
        .subscribe(result=>
        { 
          this.cliente = result; 
          this.codigo  = result.codigo;
          this.gravarEndereco(this.oEndereco);
          
          
        },error=>
        {
          this.message="Ocorreu um erro na tentativa de cadastrar um novo Cliente.";
          this.exibirMensagem(error,this.message);
        });

       
        
        this.exibirMensagem(this.message,this.message);
        this.router.navigate(['/cliente']);
    }   
  }
//** Preenchimento do objeto cliente para a gravação (novo ou atualizacao) */
  preencherObjetoCliente(){
      //Nome
      this.cliente.nome = this.form.get("nome").value;     
      this.cliente.codigosituacao = this.form.get('codigoSituacao').value;

      //Aniversario - tratamento para o atributo aniversario
      var dataNiver:string = this.form.get("dataaniversario").value;
      if (dataNiver !== '')  {
        this.cliente.dataaniversario = new Date(dataNiver);
      }else{
        this.cliente.dataaniversario= null;
      }
          

      // *** PREENCHE O ENDERECO ************ 
      //residencial
      this.oEndereco.codigoTipoEndereco = 1;
      this.oEndereco.codigoSituacao = 1;
      this.oEndereco.codigoUsuarioCadastrado = 1;

    
      this.oEndereco.descricao = (this.form.get("descricao"))?this.form.get("descricao").value:" ";
      this.oEndereco.numero =(this.form.get('numero'))?this.form.get('numero').value:" ";
      this.oEndereco.complemento = (this.form.get('complemento'))?this.form.get('complemento').value:" ";
      this.oEndereco.cep = (this.form.get('cep').value)?this.form.get('cep').value:"0";
      this.oEndereco.bairro =(this.form.get('bairro'))?this.form.get('bairro').value:" "; 
      this.oEndereco.codigoMunicipio =  (this.form.get('codigoMunicipio').value)?this.form.get('codigoMunicipio').value:null;
      
      // // //criar 
      // if (this.codigo ==  0)
      // {
      //   //******* dados do clienteContato e contato
      //   var clienteContatoTelefone= <ClienteContato>{codigoCliente :91 , codigoContato:91, contato:<Contato>{codigo:91, codigoTipoContato:1, codigosituacao : 1, codigoUsuarioCadastrado :1}};
      //   var clienteContatoCelular= <ClienteContato>{codigoCliente :92 , codigoContato:92, contato:<Contato>{codigo:92, codigoTipoContato:2, codigosituacao : 1, codigoUsuarioCadastrado :1}};
      //   var clienteContatoEmail= <ClienteContato>{codigoCliente :93 , codigoContato:93, contato:<Contato>{codigo:93, codigoTipoContato:3, codigosituacao : 1, codigoUsuarioCadastrado :1}};

      //   //******* criação das matrizes de clientes endereco e contato
      //   // this.cliente.clienteenderecos = <ClienteEndereco[]>{};
      //   // this.cliente.clientecontatos = <ClienteContato[]>{};

      //   //******* dados do cliente endereco
      //   this.oEndereco.codigo =91;
      //   var clienteEndereco = <ClienteEndereco>{
      //     codigoCliente : 0 ,
      //     codigoEndereco : 0,
      //     endereco : this.oEndereco
      //   };
      //   //this.cliente.clienteenderecos=[clienteEndereco];
      // }
      // else
      // {
      //   this.cliente.clienteenderecos[0].endereco = this.oEndereco;      
      // }
      
      

      // // // *** Preenche o Contato ************************
      // var i:number;
      // var ii :number = 0;

      // for (i=1;i<=3;i++)
      // {        
      //   //atualizando o objeto cliente
      //   if (this.codigo > 0){
      //     this.contato.descricao = this.valorContatos(i);  
      //     this.cliente.clientecontatos[ii].contato = this.contato;
      //   }
      //   else
      //   {
      //     if (i==1){
      //       clienteContatoTelefone.contato.descricao = this.valorContatos(i);
      //     }else if(i==2)
      //     {
      //       clienteContatoCelular.contato.descricao = this.valorContatos(i);
      //     }else{
      //       clienteContatoEmail.contato.descricao = this.valorContatos(i);
      //     }
      //   }

      //   ii++;
      // }
      // if (this.codigo==0){
      //   var clienteContatosCad= <ClienteContato[]>[
      //     clienteContatoTelefone,
      //     clienteContatoCelular,
      //     clienteContatoEmail
      //   ];
      //   // this.cliente.clientecontatos = clienteContatosCad;
      // }  
  }
  
  /**
   * Gravar Dados de Endereco
   * @param endereco
   */
  gravarEndereco(endereco:Endereco){
      //endereco
      this.enderecoService
      .post<Endereco>(endereco)
      .subscribe(result=>{
          this.clienteEndereco.codigoCliente = this.codigo;
          this.clienteEndereco.codigoEndereco = result.codigo;
          this.gravarClienteEndereco(this.clienteEndereco);
      },error=>{
        this.message="Ocorreu um erro na tentativa de cadastrar um novo Cliente.";
        this.exibirMensagem(error,this.message);
      });
  }
 
/** Atualiza o contato */
atualizarContato(objeto:Contato)
{
    //** rotina */
    this.contatoService.put<Contato>(objeto)
        .subscribe(result=>{
          },error=>{
                    this.message = "Ocorreu um erro na tentativa de atualizar o contato do tipo " + objeto.codigoTipoContato.toString() + "  do Cliente.";           
                    this.exibirMensagem(error,error);      
    });
}

//** Gravar contato */
incluirContato(){
  var i:number;
  var iTipo :number =1;
  var descricao:string;
  
  
  for (i=0;i<=2;i++)
  {
    this.contato.codigoTipoContato = iTipo;
    this.contato.codigoUsuarioCadastrado = 1;
    this.contato.codigosituacao = 1;
    this.contato.descricao = this.valorContatos(iTipo);  

    //gravando o contato
    this.contatoService.post<Contato>(this.contato)
    .subscribe(result=>
            {
              this.contato = result;

              //** gravando o cliente contato */
              this.clienteContatoGravar.codigoCliente = this.cliente.codigo;
              this.clienteContatoGravar.codigoContato = this.contato.codigo;

              this.incluirCLienteContato(this.clienteContatoGravar);
      },error=>{
                this.message = "Ocorreu um erro na tentativa de incluir o contato do tipo " + this.contato.codigoTipoContato.toString() + "  do Cliente.";           
                this.exibirMensagem(error,error);      
    });

    iTipo++;
  }
  
}
incluirCLienteContato(objeto:ClienteContato){
  this.clienteContatoService.post<ClienteContato>(objeto).subscribe(result=>{},error=>{
    this.message = "Ocorreu um erro na tentativa de incluir o cliente-contato do tipo do Cliente.";           
    this.exibirMensagem(error,error);      
  })
}

valorContatos(tipo:number)
{
  var strRetorno :string;

  if (tipo == 1)//telefone fixo;
  {
    strRetorno =  (this.form.get("telefoneFixo"))?(this.form.get('dddFixo').value) +this.form.get("telefoneFixo").value:"";
  }
  else if(tipo ==  2) //celular
  {
    strRetorno =  (this.form.get("celular"))? (this.form.get('dddCel').value +  this.form.get("celular").value):"";  
  }
  else //email
  {
    strRetorno = (this.form.get("email"))?this.form.get("email").value:"";
  }
  return strRetorno;

}


  /**
   * Gravar cliente endereco
   * @param clienteEndereco 
   */
  gravarClienteEndereco(clienteEndereco:ClienteEndereco){
    this.clienteEnderecoService.post<ClienteEndereco>(clienteEndereco)
        .subscribe(result=>
        {
         
         //**Gravar contato e cliente contato */
         this.incluirContato();

        },error=>{
          this.message="Ocorreu um erro na tentativa de cadastrar o cliente endereco do  novo Cliente.";
          this.exibirMensagem(error,this.message);
    })
  }
  //**** função de exclusao */
  onDelete(){
    if (confirm('Tem certeza que deseja apagar este registro?')){
       if (this.apagarClienteEndereco()==false)
       {
         return;
       }
       if (this.apagarClienteContato()==false)
       {
         return;
       }

       //this.mensagemExclusaoSucesso();     
       if(this.apagarCliente()==false){
         return;
       }                
    }    
  }

  //** apagar cliente*/   
  apagarCliente(){
    this.clienteService.delete<Cliente>(this.cliente.codigo)
    .subscribe(result=>
     {
      this.mensagemExclusaoSucesso();     

     },error=>{
       this.message="Atenção!Ocorreu um erro na tentativa de apagar o registro!";              
       this.exibirMensagem(error, this.message);
       return false;
     });
     return true;

  }
  

  //** apagar contatos e  clientes contatos */
   apagarClienteContato(){
    var i:number=0;
    
    this.clienteContatoService.get<ClienteContato[]>(this.codigo)
        .subscribe(result=>
        {
          this.clienteContatos  = result;

          for (i=0;i<=(this.clienteContatos.length-1);i++)
          {
            this.clienteContatoService.apagar(this.clienteContatos[i].codigoCliente,this.clienteContatos[i].codigoContato)
                                      .subscribe(result=>
                                        {

                                            this.contatoService.delete(this.clienteContatos[i].contato.codigo)
                                                .subscribe(result=>{},
                                                  error=>{
                                                    this.message="Atenção!Ocorreu um erro na tentativa de apagar Contato index" + i.toString() + " do cliente!";              
                                                    this.exibirMensagem(error, this.message);
                                                  });
                                        }
                                        ,error=>
                                        {
                                          this.message="Atenção!Ocorreu um erro na tentativa de apagar o cliente-contato index" + i.toString();              
                                          this.exibirMensagem(error, this.message);                                       
                                          return false;
                                      });      
          }     
        });
    
    return true;
   }
  //** apagar cliente + endereco*/   
  apagarClienteEndereco()
  {
    var bln_existe :boolean = false;
    var i:number =0;

    this.clienteEnderecoService.get<ClienteEndereco[]>(this.clienteEndereco.codigoCliente)
        .subscribe(result=>
        {

          this.clienteEnderecos = result;

          for (i=0;i<=this.clienteEnderecos.length-1;i++)
          {

            this.clienteEnderecoService.Apagar(this.clienteEnderecos[i].codigoCliente,this.clienteEnderecos[i].codigoEndereco)
            .subscribe(result=>
              {
                this.apagarEndereco(this.clienteEnderecos[0].codigoEndereco);  
              },error=>{
                this.message="Atenção!Ocorreu um erro na tentativa de apagar o cliente-endereco index " + i.toString() + "!";              
                this.exibirMensagem(error, this.message);
                return false
              });
          }      
        })          ;

 
    return true;
  }

  //** apagar endereco*/   
  apagarEndereco(codigo:number){
                                    
    this.enderecoService.delete<Endereco>(codigo)
        .subscribe(result=>{
              
        },error=>{          
                                    this.message="Atenção!Ocorreu um erro na tentativa de apagar o endereço endereco!";              
                                    this.exibirMensagem(error, this.message);
                                  });
  }

  //** apagar mensagem de exclusao com sucesso*/   
  mensagemExclusaoSucesso(){
    this.message ="Cliente com o código: " + this.cliente.codigo + " apagado com sucesso!";
           this.exibirMensagem(this.message,this.message);              
           this.router.navigate(['/cliente']);
  }

  //** exibir mensagem */   
  exibirMensagem(error:any, mensagem:string){        
    console.log(error);
    this.snackBar.open(this.message,'',{duration:3000,verticalPosition:'top',horizontalPosition:'center'});
  }
 
  //** validar se existe*/   
  isDupeCliente():AsyncValidatorFn{
    
    return (control:AbstractControl):Observable<{[key:string]:any } | null> =>
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

  //** selecionar estado*/   
  onSelected_UF(){
    if (this.cod_unida_fed > 0 ){
      this.listaMunicipio();
    }    
   }

   //** lista de municipios*/   
  listaMunicipio(){
            
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

//** lista de enderecos*/   
  listaEnderecos()
  {    
    this.clienteEnderecoService.get<ClienteEndereco[]>(this.codigo)    
        .subscribe(result=>
                    {  
                        this.clienteEnderecos = result;      
                        this.clienteEndereco = result[0];                        
                        //this.cliente.clienteenderecos=this.clienteEnderecos;
                        //** dados de endereco*/  
                        this.oEndereco = result[0].endereco;
                            
                        if (this.oEndereco.codigoMunicipio!=undefined  ){
                          this.municipioService.get<Municipio>(this.oEndereco.codigoMunicipio).subscribe(
                            result=>{
                              this.cod_unida_fed = result.codigoUnidadeFederativa;                
                            }
                          );            
            
                        }
                        this.form.patchValue(this.oEndereco);  
                                
                    },error=>console.error(error));           
                        ;
  } 
  

  //** Recuperar lista de cliente-contato */
  listaClienteContato(){
     this.clienteContatoService.get<ClienteContato[]>(this.codigo)
         .subscribe(result=>{           
             this.clienteContatos = result;
             //this.cliente.clientecontatos = result;
             var i:number;
             var descricaoAux:string;
             var descricaoDB:string;

             for( i=0;i<=this.clienteContatos.length-1;i++)
             {
              descricaoAux =  "";
              descricaoDB="";

              if (this.clienteContatos[i].contato.codigoTipoContato==1) //telefone fixo
              {
                if(this.clienteContatos[i].contato.descricao !="*" && this.clienteContatos[i].contato.descricao!='' )  {
                  descricaoAux =   this.clienteContatos[i].contato.descricao.substr(0,2);
                  descricaoDB=this.clienteContatos[i].contato.descricao.substr(2,(this.clienteContatos[i].contato.descricao.length-2));
                }               

                this.contatoView.dddFixo = descricaoAux;                
                this.contatoView.telefoneFixo = descricaoDB;
  
              }else if (this.clienteContatos[i].contato.codigoTipoContato ==2) //celular
              {
                if(this.clienteContatos[i].contato.descricao !="*" && this.clienteContatos[i].contato.descricao!='' )  {
                  descricaoAux =   this.clienteContatos[i].contato.descricao.substr(0,2);
                  descricaoDB=this.clienteContatos[i].contato.descricao.substr(2,(this.clienteContatos[i].contato.descricao.length-2));
                }
                 this.contatoView.dddCel = descricaoAux;
                 this.contatoView.celular = descricaoDB;
  
              }else //e-mail
              {
                if(this.clienteContatos[i].contato.descricao !="*" && this.clienteContatos[i].contato.descricao!='' )  {
                  this.contatoView.email = this.clienteContatos[i].contato.descricao;                
                }       
              }
             }
            
           this.form.patchValue(this.contatoView);   
         },error=>console.error(error));

  } 

  validarDDDFixo(){
    if(this.form.get('telefoneFixo').value !== ''){
      this.form.controls['dddFixo'].setValidators([Validators.required,, Validators.min(0), Validators.max(99)]);              
    } else {                
        this.form.controls['dddFixo'].setValidators(null);               
    }
    this.form.controls['dddFixo'].updateValueAndValidity();
  }

  validarDDDCelular(){
    if(this.form.get('celular').value !== ''){
      this.form.controls['dddCel'].setValidators([Validators.required, Validators.min(0),Validators.max(99)]);              
    } else {                
        this.form.controls['dddCel'].setValidators(null);               
    }
    this.form.controls['dddCel'].updateValueAndValidity();
  }
}
 