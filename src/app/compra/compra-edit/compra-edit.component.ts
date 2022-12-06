import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { EMPTY, of, Subscription } from 'rxjs';
import { concatMap, map } from 'rxjs/operators';
import { AuthService } from 'src/app/auth-guard/auth.service';
import { CompraDetalhe } from 'src/app/compra-detalhe/compra-detalhe';
import { CompraDetalheService } from 'src/app/compra-detalhe/compra-detalhe.service';
import { Estoque } from 'src/app/estoque/estoque';
import { EstoqueService } from 'src/app/estoque/estoque.service';
import { Produto } from 'src/app/produto/produto';
import { ProdutoService } from 'src/app/produto/produto.service';
import { AlertService } from 'src/app/shared/alert/alert.service';
import { BaseFormComponent } from 'src/app/shared/base-form/base-form.component';
import { ApiResult } from 'src/app/shared/base.service';
import { Compra } from '../compra';
import { CompraBaixaPagtoComponent } from '../compra-baixa-pagto/compra-baixa-pagto.component';
import { CompraServiceService } from '../compra-service.service';

@Component({
  selector: 'app-compra-edit',
  templateUrl: './compra-edit.component.html',
  styleUrls: ['./compra-edit.component.scss']
})
export class CompraEditComponent  extends BaseFormComponent implements OnInit {
  compra: Compra;
  formulario: UntypedFormGroup;
  codigo: number;
  tituloPagina:string;
  habilitaApagar:boolean;
  valorDigitado: number = 0;
  valorTotalProdutoAdd = 0;

  produtos:Array<Produto>;  
  listaCompraDetalhe: Array<CompraDetalhe>=[];
  inscricao$: Subscription;
  inscricaoDetalhe$: Subscription;
  inscricaoProduto$: Subscription;
  inscricaoEstoque$: Subscription;
  inscricaoEstoqueSubmit$: Subscription;

  codigoProdutoAdd : number = 0;
  quantidadeProdutoAdd: number = 0;
  valorUnitarioAdd: number = 0;

  events: string[] = [];
  dataMaximaCompra : Date = new Date(new Date().toDateString());
  dataCompraHoje = (c:UntypedFormControl)=>{
    let valor = new Date(c.value);

    return (valor.getDate() <= this.dataMaximaCompra.getDate()) ? true:false;    
  }

  date = new UntypedFormControl(new Date());
  serializedDate = new UntypedFormControl(new Date().toISOString());
  constructor(
    private formBuilder: UntypedFormBuilder,
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router,
    private serviceAlert:AlertService,
    private produtoService: ProdutoService,
    private compraService : CompraServiceService,
    private compraDetalheService: CompraDetalheService,
    private estoqueService: EstoqueService,
    public dialog: MatDialog,
  ) 
  {
    super();
  }

  ngOnInit(): void {
     
    this.compra = this.route.snapshot.data['compra']=== undefined ? {codigo : null, valor : null, dataCompra : null, dataPagtoBoleto : null, listaCompraDetalhe  : null,dataVenctoBoleto : null } as Compra:   this.route.snapshot.data['compra'];

    
    this.codigo = this.compra == null? 0 : this.compra.codigo;
    this.listaProdutos();
    this.loadData();
    this.criacaoFormulario();    
    this.valorTotalProdutoAdd = this.compra == null?0: this.compra.valor;
    this.tituloPagina = this.codigo>0 ?"consulta de registro": "Novo registro"

    }
  ngOnDestroy():void{

    if(this.inscricao$){
      this.inscricao$.unsubscribe();
    }
    if(this.inscricaoDetalhe$){
      this.inscricaoDetalhe$.unsubscribe();
    }
    if(this.inscricaoEstoque$){
      this.inscricaoEstoque$.unsubscribe();
    }
    if (this.inscricaoEstoqueSubmit$){
      this.inscricaoEstoqueSubmit$.unsubscribe();
    }
  }
  criacaoFormulario(){
    let dataBoleto = new Date();
    dataBoleto.setDate(dataBoleto.getDate()+30);
    //formulario cliente
    this.formulario = this.formBuilder.group({
      codigo: [this.compra.codigo],
      valor: [this.compra.valor,[Validators.required,Validators.min(1), Validators.max(9999)]],
      dataCompra: [this.compra.dataCompra === null? new Date() : this.compra.dataCompra, [Validators.required,this.dataCompraHoje]],      
      dataVenctoBoleto:[this.compra.dataVenctoBoleto === null ? dataBoleto : this.compra.dataVenctoBoleto,[Validators.required]],
      dataPagtoBoleto:[this.compra.dataPagtoBoleto!== null ? this.compra.dataPagtoBoleto : null],
      observacao:[this.compra.observacao]
    });
  }
  allowNumericDigitsOnlyOnKeyUp(e) {		
		const charCode = e.which ? e.which : e.keyCode;
		if (charCode !== 190 && charCode !== 46 && charCode!==44){
      if (charCode > 31  && (charCode < 48 || charCode > 57)) {
        this.handleError("Por favor, informar apenas numeros e casas decimais");        
      }
    }	 
	}
  submit() {
     
    let dataCompraParam = new Date(new Date(this.formulario.get('dataCompra').value));
    
    let dataBoletoParam = new Date(this.formulario.get('dataVenctoBoleto').value);
    let valorTotalParam = this.formulario.get('valor').value;
       
    if ( dataCompraParam.getTime() > dataBoletoParam.getTime()){
      this.handleError('Por favor, verificar se a data de boleto está correta');
      return false;
    }

    //preeenchendo o objeto compra.
    this.compra.codigo = 0;    
    this.compra.dataCompra = dataCompraParam;
    this.compra.dataVenctoBoleto = dataBoletoParam;    
    this.compra.valor = parseFloat(valorTotalParam);
    this.compra.observacao = this.formulario.get('observacao').value;
    this.compra.dataCadastro = this.dataHoraAtualSemTimeZone();
    let codigoCompraDetalhe:number = 1;
    //salvando o registro.
    this.inscricao$ =  this.compraService.save(this.compra)
                                        .pipe(
                                          concatMap( (result:Compra) =>
                                            {

                                              
                                              this.listaCompraDetalhe.forEach(detalhe =>{

                                                detalhe.codigoCompra = result.codigo;
                                                detalhe.codigo = codigoCompraDetalhe;
                                                detalhe.dataCadastro = this.dataHoraAtualSemTimeZone();
                                                detalhe.produto = null;
                                                codigoCompraDetalhe++;
                                              })

                                              this.inscricaoDetalhe$ = this.compraDetalheService.salvarLista(this.listaCompraDetalhe)
                                                                                                .subscribe();
                                              

                                              return of (true);
                                            }                                           
                                          )
                                        ).subscribe(result=>{
                                          if (result){
                                              let dataCorrente = new Date ();                                             

                                              //gravando no estoque
                                              this.listaCompraDetalhe.forEach(detalhe=>{
                                                
                                                let estoqueParam = {
                                                                      codigoProduto : detalhe.codigoProduto,
                                                                      dataEntrada : dataCorrente,
                                                                      valorUnitario : detalhe.valorUnitario,
                                                                      quantidadeEstoque : detalhe.quantidadeProduto
                                                                   } as Estoque;

                                                this.inscricaoEstoque$ = this.estoqueService.existeEstoque(estoqueParam)
                                                                                             .pipe(
                                                                                               concatMap((retornoExiste : boolean)=>{
                                                                                                 if (retornoExiste){
                                                                                                  this.inscricaoEstoqueSubmit$ = this.estoqueService.atualizarQuantidadeEstoque(estoqueParam)
                                                                                                                      .subscribe(()=>{},error=>{
                                                                                                                        console.log(error);
                                                                                                                        this.handlerSuccess('Ocorreu um erro na atualização da quantidade de estoque.');
                                                                                                                      });
                                                                                                 }
                                                                                                 else
                                                                                                 {
                                                                                                    this.inscricaoEstoqueSubmit$ = this.estoqueService.save(estoqueParam)
                                                                                                                     .subscribe(()=>{},
                                                                                                                     error=>{
                                                                                                                      console.log(error);
                                                                                                                      this.handlerSuccess('Ocorreu um erro no cadastro de estoque.');
                                                                                                                     });
                                                                                                 }
                                                                                                  return of(true);
                                                                                                })
                                                                                             )
                                                                                             .subscribe();

                                              });

                                            this.codigo = 0;
                                            this.listaCompraDetalhe = null;
                                            this.handlerSuccess('Compra salva com sucesso!');
                                            setTimeout(() => { this.retornar(); }, 3000);
                                          }
                                        });
  } 
  retornar()
  {
    this.router.navigate(['compra']);    
  }
  handleError(msg:string)
  {
    this.serviceAlert.mensagemErro(msg);
  }
  
  handlerSuccess(msg: string) {
    this.serviceAlert.mensagemSucesso(msg);
  }
  listaProdutos()
  {
    this.inscricao$ = this.produtoService.list<ApiResult<Produto>>().subscribe(result=>{
       
       this.produtos = result.data;
    },
    error=>{
      console.log(error);
      if (error.status !==404){
        this.handleError('Ocorreu um erro na recuperação da lista de produtos');
      }
      else{
        return EMPTY;
      }
    })
  }
  adicionarProduto()
  {    
    //consistencias
    if (this.codigoProdutoAdd == 0 ){
      this.handleError('Por favor, selecione um produto da lista.');
      return false;
    }
    if (this.valorUnitarioAdd === 0  || this.valorUnitarioAdd === undefined){
      this.handleError('Por favor, informe o valor unitário do produto comprado.');
      return false;
    }
    if (this.quantidadeProdutoAdd === 0  || this.quantidadeProdutoAdd === undefined){
      this.handleError('Por favor, informe a quantidade de produto comprado.');
      return false;
    }
    if (this.valorUnitarioAdd.toString().indexOf('.')!= -1 && this.valorUnitarioAdd.toString().indexOf(',')==-1){
      this.handleError('Por favor, verificar se o valor unitário foi informado corretamente.Exemplo: 1 ou 1,00 ou 1.000,00');
      return false;
    }
    let valorUnitarioParam = parseFloat(this.valorUnitarioAdd.toString().replace('.','').replace(',','.'));

    let index  = this.listaCompraDetalhe.findIndex(x=>x.codigoProduto == this.codigoProdutoAdd && x.valorUnitario == valorUnitarioParam);
    
    if (index !== -1){        
        this.listaCompraDetalhe[index].quantidadeProduto += this.quantidadeProdutoAdd;        
    }
    else
    {
        this.adicionarLista();
    }
    //somando valores
    this.valorTotalProdutoAdd += (valorUnitarioParam * this.quantidadeProdutoAdd);    
    this.formulario.controls['valor'].setValue(this.valorTotalProdutoAdd);

    
   // this.formulario.controls['valor'].setValue(this.valorTotalProdutoAdd);
    //limpando os campos
    this.codigoProdutoAdd = 0;
    this.quantidadeProdutoAdd = 1;
    this.valorUnitarioAdd = 0;  
  }

  adicionarLista(){
    let produtoSelecionado = this.produtos.find(x=>x.codigo == this.codigoProdutoAdd);
    let valorUnitarioAdicionar : number = parseFloat(this.valorUnitarioAdd.toString().replace('.','').replace(',','.'));

    const produtoAdicionar = {
      codigo : this.codigo,
      codigoProduto : this.codigoProdutoAdd,
      quantidadeProduto : this.quantidadeProdutoAdd,
      valorUnitario : valorUnitarioAdicionar, 
      produto : <Produto>{codigo : this.codigoProdutoAdd,
      nome :  produtoSelecionado.nome}
    } as CompraDetalhe;

   this.listaCompraDetalhe.push(produtoAdicionar);
  }

  removerDaLista(codigoProduto:number, valorUnitario:number)
  {
    if (this.listaCompraDetalhe.length == 1){
      this.valorTotalProdutoAdd =0;      
      this.listaCompraDetalhe.splice(0,1);

    }else{
      let index  = this.listaCompraDetalhe.findIndex(x=>x.codigoProduto == codigoProduto && x.valorUnitario == valorUnitario);
      this.listaCompraDetalhe.splice(index,1);
      this.valorTotalProdutoAdd -= valorUnitario;
    }
    
    
    
    this.formulario.controls['valor'].setValue(this.valorTotalProdutoAdd);

  }
  calcularDataBoleto(){
    let dataBoleto = new Date(this.formulario.get("dataCompra").value);
    dataBoleto.setDate( dataBoleto.getDate() + 30 );

    this.formulario.controls["dataVenctoBoleto"].setValue(dataBoleto);
  }

  addEventDigitarESelecionarBoleto(type: string, event: MatDatepickerInputEvent<Date>) {
    let dataBoleto =   new Date(event.value);
    if (type === "input"){
      
      if (event.value !== null )
      {
        let dataCompra = new Date(this.formulario.get('dataCompra').value);
        
        if (dataCompra.getDate() > dataBoleto.getDate()){
          this.handleError('Por favor, verifique se a data de boleto está superior da data de Compra.');
        
        
          return false;
        }
      }
    }
    this.events.push(`${type}: ${event.value}`);
  }

  loadData(){
    
    this.listaProdutos();

    if (this.codigo > 0 ){
      this.inscricao$ = this.compraService.get(this.codigo)
                                          .pipe(
                                              concatMap((result:Compra)=>
                                              {
                                                let objCompra = result; 
                                                i : Number;
                                                objCompra.listaCompraDetalhe.forEach(detalhe=>{
                                                  detalhe.produto = this.produtos.find(x=>x.codigo == detalhe.codigoProduto);
                                                 })
                                               /*  for ( let i=0; i <= (itotal-1);i++){
                                                    
                                                    let nomeProdt =  this.produtos.find(x=>x.codigo == result.listaCompraDetalhe[i].codigoProduto).nome;

                                                    result.listaCompraDetalhe[i].produto = {codigo : result.listaCompraDetalhe[i].codigo , nome :nomeProdt} as Produto ;
                                                } */
                                                  
                                                    

                                                
                                                                                                 
                                                
                                                  return of (result);
                                              }
                                              
      ))
      .subscribe( (resultado : Compra) =>{
         this.listaCompraDetalhe = resultado.listaCompraDetalhe;
      }, error=>{
         console.log(error);
         this.handleError('Ocorreu um erro');
      });      
    }
  }
  
  dialogBaixaPagto(){   
    

     // montando o dialogo
     const dialogRef = this.dialog.open(CompraBaixaPagtoComponent,
      {width: '700px' , height: '900px;',
        data : {
                 codigoCompra: this.compra.codigo,
                 dataCompra: this.compra.dataCompra,
                 dataBoleto: this.compra.dataVenctoBoleto,
                 valorTotal: this.compra.valor
                }
      }
    );
    dialogRef.afterClosed().subscribe(result => {
      this.inscricao$ = this.compraService.get<Compra>(this.codigo).subscribe(result=>{        
        this.formulario.controls['dataPagtoBoleto'].setValue( result.dataPagtoBoleto);
      },error=>{
        console.log(error);
        this.handleError('Erro ao consultar informações da compra.');
      })
       
    });
  }
}
