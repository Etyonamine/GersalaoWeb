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
import { Component } from '@angular/core';
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
    this.oEndereco = <Endereco>{};
    this.clienteEndereco = <ClienteEndereco>{};
    this.clienteContatos = <ClienteContato[]>{};
    this.clienteContatoGravar = <ClienteContato>{};
    this.contato = <Contato>{};
    
    this.contatoView = <ContatoView>{};


     //**** elementos do formulario
     this.form = new FormGroup({
       codigoUnidadeFederativa:new FormControl(''),
       nome: new FormControl('', Validators.required),
       aniversario:new FormControl('') ,
       codigosituacao:new FormControl('',Validators.required),
       descricao:new FormControl(''),
       numero:new FormControl(''),
       bairro:new FormControl(''),
       complemento:new FormControl(''),
       cep:new FormControl(''),
       codigoUF: new FormControl('')      ,
       codigoMunicipio:new FormControl('') ,       
       email : new FormControl('',Validators.email),
       telefoneFixo:new FormControl(''),
       celular:new FormControl(''),
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

        
        this.aniversarioformatado = this.cliente.aniversario;
        this.situacao = this.cliente.codigosituacao;
       
        //update the form with the city value
        this.form.patchValue(this.cliente);      
      
      },error=>{
        console.error(error);

      });
      this.listaEnderecos();
      this.listaClienteContato();
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
    cliente.codigosituacao = this.form.get('codigosituacao').value;

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
    this.oEndereco.codigoSituacao = 1;
    this.oEndereco.codigoUsuarioCadastrado = 1;
    

    this.oEndereco.descricao = (this.form.get("endereco"))?this.form.get("endereco").value:" ";
    this.oEndereco.numero =(this.form.get('numero'))?this.form.get('numero').value:" ";
    this.oEndereco.complemento = (this.form.get('complemento'))?this.form.get('complemento').value:" ";
    this.oEndereco.cep = (this.form.get('cep').value)?this.form.get('cep').value:"0";
    this.oEndereco.bairro =(this.form.get('bairro'))?this.form.get('bairro').value:" "; 
    this.oEndereco.codigoMunicipio =  (this.form.get('codigoMunicipio').value)?this.form.get('codigoMunicipio').value:null;
    
    //Determinando o fluxo do processamento (edição ou novo registro)
    if (this.codigo){
      //edição
      
      //** CLIENTE */
      this.clienteService.put<Cliente>(cliente)
        .subscribe(result=>{
           //** ENDERECO */
            this.enderecoService.put<Endereco>(this.oEndereco)
            .subscribe(result=>{
                    bln_gravado=true;
                    //** CONTATO */
                    // *** PREENCHENO O CONTATO ************ 
                    var i:number=0;
                    for (i=0;i<=2;i++)
                    {
                      if (this.clienteContatos[i].contato.codigoTipoContato ==3){
                        // email
                        this.clienteContatos[i].contato.descricao = (this.form.get("email"))?this.form.get("email").value:" ";
                        
                      }else if (this.clienteContatos[i].contato.codigoTipoContato ==2)
                      {
                        // celular
                        this.clienteContatos[i].contato.descricao = (this.form.get("celular"))?this.form.get("celular").value:" ";              
                        
                      }else
                      {
                        // telefone fixo
                        this.clienteContatos[i].contato.descricao = (this.form.get("telefoneFixo"))?this.form.get("telefoneFixo").value:" ";
                      }

                      //** atualizar registro */
                      this.atualizarContato(this.clienteContatos[i].contato); //telefone fixo
                    }

                    //** mensagem e redirecionamento */
                    this.message="Cliente código:" + cliente.codigo + " atualizado com sucesso!";
                    this.exibirMensagem(this.message,this.message);
                    this.router.navigate(['/cliente']);
            },
            error=>{
              this.message = "Ocorreu um erro na tentativa de atualizar o endereco do Cliente.";           
            this.exibirMensagem(error,error);
              bln_gravado= false;
            });
        },
        error=>{
          this.message = "Ocorreu um erro na tentativa de atualizar os dados basicos do Cliente.";           
          this.exibirMensagem(error,error);
          bln_gravado= false;
        });  
    }
    else{
      this.message ="Cliente cadastrado com sucesso!";
      this.oEndereco.codigo=0;
      this.oEndereco.dataCadastro = new Date();

      cliente.codigousuariocadastro = 1;

       //novo registro
       //cliente
      this.clienteService
        .post<Cliente>(cliente)
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
incluirContato(objeto:Contato){
  this.contatoService.post<Contato>(objeto)
  .subscribe(result=>{
          this.contato = result;
          this.clienteContatoGravar.codigoCliente = this.cliente.codigo;
          this.clienteContatoGravar.codigoContato = this.contato.codigo;
          
          this.incluirCLienteContato(this.clienteContatoGravar);

    },error=>{
              this.message = "Ocorreu um erro na tentativa de incluir o contato do tipo " + objeto.codigoTipoContato.toString() + "  do Cliente.";           
              this.exibirMensagem(error,error);      
  });
}
incluirCLienteContato(objeto:ClienteContato){
  this.clienteContatoService.post<ClienteContato>(objeto).subscribe(result=>{},error=>{
    this.message = "Ocorreu um erro na tentativa de incluir o cliente-contato do tipo do Cliente.";           
    this.exibirMensagem(error,error);      
  })
}



  /**
   * Gravar cliente endereco
   * @param clienteEndereco 
   */
  gravarClienteEndereco(clienteEndereco:ClienteEndereco){
    this.clienteEnderecoService.post<ClienteEndereco>(clienteEndereco)
        .subscribe(result=>
        {
         
          //** CONTATO */
          // *** PREENCHENO O CONTATO ************ 
          // email
          this.contato.descricao = (this.form.get("email"))?this.form.get("email").value:" ";
          this.contato.codigoTipoContato = 3;
          this.contato.codigosituacao = 1;
          this.incluirContato(this.contato); //e-mail
          // telefone fixo
          this.contato.descricao = (this.form.get("telefoneFixo"))?this.form.get("telefoneFixo").value:" ";
          this.contato.codigoTipoContato = 1;
          this.contato.codigosituacao = 1;
          this.incluirContato(this.contato); //telefone fixo
          // celular
          this.contato.descricao = (this.form.get("celular"))?this.form.get("celular").value:" ";              
          this.contato.codigoTipoContato = 2;
          this.contato.codigosituacao = 1;
          this.incluirContato(this.contato); //celular

        },error=>{
          this.message="Ocorreu um erro na tentativa de cadastrar o cliente endereco do  novo Cliente.";
          this.exibirMensagem(error,this.message);
    })
  }
  //**** função de exclusao */
  onDelete(){
    if (confirm('Tem certeza que deseja apagar este registro?')){
      this.apagarClienteEndereco();        
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
     });
  }

  //** apagar cliente + endereco*/   
  apagarClienteEndereco()
  {
    this.clienteEnderecoService.Apagar<ClienteEndereco>(this.clienteEndereco.codigoCliente,this.clienteEndereco.codigoEndereco)
                                .subscribe(result=>
                                  {
                                    this.apagarEndereco();

                                  },error=>{
                                    this.message="Atenção!Ocorreu um erro na tentativa de apagar o cliente-endereco!";              
                                    this.exibirMensagem(error, this.message);
                                  });
  }

  //** apagar endereco*/   
  apagarEndereco(){
                                    
    this.enderecoService.delete<Endereco>(this.oEndereco.codigo)
        .subscribe(result=>{
          this.apagarCliente();
         
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
    this.clienteEnderecoService.get(this.codigo)    
        .subscribe(result=>
                    {        
                        this.clienteEndereco = result[0];
                        this.dadosEndereco(result[0].codigoEndereco );
                    },error=>console.error(error));           
                        ;
  }

//** dados de endereco*/   
  dadosEndereco(codigo:number){
    this.enderecoService.get<Endereco>(codigo)
        .subscribe(result=>
          {
              //update the form with the endereco value
            this.oEndereco = (result)?result:<Endereco>{};
            this.form.patchValue(this.oEndereco);              
            
            if (this.oEndereco.codigoMunicipio!=undefined ){
              this.municipioService.get<Municipio>(this.oEndereco.codigoMunicipio).subscribe(
                result=>{
                  this.cod_unida_fed = result.codigoUnidadeFederativa;                
                }
              );            

            }
            
          });
  }
 
  

  //** Recuperar lista de cliente-contato */
  listaClienteContato(){
     this.clienteContatoService.get<ClienteContato[]>(this.codigo)
         .subscribe(result=>{           
             this.clienteContatos = result;
             
             var i:number;

             for( i=0;i<=2;i++)
             {
              if (this.clienteContatos[i].contato.codigoTipoContato==1) //telefone fixo
              {  
              
                this.contatoView.telefoneFixo = this.clienteContatos[i].contato.descricao;
  
              }else if (this.clienteContatos[i].contato.codigoTipoContato ==2) //celular
              {
                 this.contatoView.celular =this.clienteContatos[i].contato.descricao;;
  
              }else //e-mail
              {
                this.contatoView.email = this.clienteContatos[i].contato.descricao;                
              }
             }
            
           this.form.patchValue(this.contatoView);   
         },error=>console.error(error));

  }
 
}
 