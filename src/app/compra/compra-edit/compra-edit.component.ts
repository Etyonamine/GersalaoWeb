import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { ActivatedRoute, Router } from '@angular/router';
import { of, Subscription } from 'rxjs';
import { concatMap, map } from 'rxjs/operators';
import { AuthService } from 'src/app/auth-guard/auth.service';
import { CompraDetalhe } from 'src/app/compra-detalhe/compra-detalhe';
import { CompraDetalheService } from 'src/app/compra-detalhe/compra-detalhe.service';
import { Produto } from 'src/app/produto/produto';
import { ProdutoService } from 'src/app/produto/produto.service';
import { AlertService } from 'src/app/shared/alert/alert.service';
import { BaseFormComponent } from 'src/app/shared/base-form/base-form.component';
import { ApiResult } from 'src/app/shared/base.service';
import { Compra } from '../compra';
import { CompraServiceService } from '../compra-service.service';

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
  valorDigitado: number = 0;
  valorTotalProdutoAdd = 0;

  produtos:Array<Produto>;  
  listaCompraDetalhe: Array<CompraDetalhe>=[];
  inscricao$: Subscription;
  inscricaoDetalhe$: Subscription;

  codigoProdutoAdd : number = 0;
  quantidadeProdutoAdd: number = 0;
  valorUnitarioAdd: number = 0;

  events: string[] = [];
  dataMaximaCompra : Date = new Date(new Date().toDateString());
  dataCompraHoje = (c:FormControl)=>{
    let valor = new Date(c.value);

    return (valor.getDate() <= this.dataMaximaCompra.getDate()) ? true:false;    
  }

  date = new FormControl(new Date());
  serializedDate = new FormControl(new Date().toISOString());
  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router,
    private serviceAlert:AlertService,
    private produtoService: ProdutoService,
    private compraService : CompraServiceService,
    private compraDetalheService: CompraDetalheService,
    
  ) 
  {
    super();
  }

  ngOnInit(): void {
    this.compra = this.route.snapshot.data['compra']=== undefined?{codigo : null, dataCompra : null, valor: null, dataVenctoBoleto : null, dataPagtoBoleto:null, observacao: null}:this.route.snapshot.data['compra'];
    this.codigo = this.compra.codigo == null? 0 : this.compra.codigo;
    this.loadData();
    this.criacaoFormulario();
    this.listaProdutos();
    this.valorTotalProdutoAdd = this.compra == null?0: this.compra.valor;
    

    }
  ngOnDestroy():void{

    if(this.inscricao$){
      this.inscricao$.unsubscribe();
    }
    if(this.inscricaoDetalhe$){
      this.inscricaoDetalhe$.unsubscribe();
    }
  }
  criacaoFormulario(){
    let hoje = new Date();

    //formulario cliente
    this.formulario = this.formBuilder.group({
      codigo: [this.compra.codigo],
      valor: [this.compra.valor,[Validators.required,Validators.min(1), Validators.max(9999)]],
      dataCompra: [this.compra.dataCompra === null? new Date:this.compra.dataCompra, [Validators.required,this.dataCompraHoje]],      
      dataVenctoBoleto:[this.compra.dataVenctoBoleto === null?new Date: this.compra.dataVenctoBoleto,[Validators.required]],
      dataPagtoBoleto:[this.compra.dataPagtoBoleto],
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
    this.compra = Object.assign({}, this.formulario.value);
    let dataCompraParam = new Date(this.formulario.get('dataCompra').value);
    let dataBoletoParam = new Date(this.formulario.get('dataVenctoBoleto').value);
    let valorTotalParam = this.formulario.get('valor').value;
       
    if ( dataCompraParam.getDate() > dataBoletoParam.getDate()){
      this.handleError('Por favor, verificar se a data de boleto está correta');
      return false;
    }

    //preeenchendo o objeto compra.
    this.compra.codigo = 0;    
    this.compra.dataCompra = dataCompraParam;
    this.compra.dataVenctoBoleto = dataBoletoParam;    
    this.compra.valor = parseFloat(valorTotalParam);
    this.compra.observacao = this.formulario.get('observacao').value;
    this.compra.dataCompra = new Date();
    
    //salvando o registro.
    this.inscricao$ =  this.compraService.save(this.compra)
                                        .pipe(
                                          concatMap( (result:Compra) =>
                                            {
                                              let codigoCompra  = result.codigo;
                                              this.listaCompraDetalhe.forEach(detalhe=>{
                                                  detalhe.codigo = 0 ;    
                                                  detalhe.produto = null;                                              
                                                  detalhe.codigoCompra = codigoCompra;
                                                  detalhe.dataCadastro = new Date();
                                                  this.inscricaoDetalhe$ = this.compraDetalheService.save(detalhe)
                                                                          .subscribe(result=>{},error=>{                                                                            
                                                                            this.compraDetalheService.excluirTodosProdutos(codigoCompra).subscribe();
                                                                            this.compraService.delete(codigoCompra).subscribe();
                                                                            console.log(error);
                                                                            this.handleError('Ocorreu um erro ao tentar salvar um produto da compra.Será desfeito a operação.');
                                                                          });
                                              })
                                              
                                              return of (true);
                                            }                                           
                                          )
                                        ).subscribe(result=>{
                                          if (result){
                                            this.handlerSuccess('Compra salva com sucesso!');
                                            setTimeout(() => { this.retornar(); }, 3000);
                                          }
                                        });
  } 
  retornar()
  {
    this.router.navigate(['/compra']);
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
      this.handleError('Ocorreu um erro na recuperação da lista de produtos');
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
    this.quantidadeProdutoAdd = null;
    this.valorUnitarioAdd = null;  
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

    let index  = this.listaCompraDetalhe.findIndex(x=>x.codigoProduto == codigoProduto && x.valorUnitario == valorUnitario);
    this.listaCompraDetalhe.splice(index,1);
    this.valorTotalProdutoAdd -= valorUnitario;
    this.formulario.controls['valor'].setValue(this.valorTotalProdutoAdd);

  }
  addEventDigitarESelecionarBoleto(type: string, event: MatDatepickerInputEvent<Date>) {
    let dataBoleto = new Date(event.value);
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
    if (this.codigo > 0 ){
      this.inscricao$ = this.compraService.get<Compra>(this.codigo).subscribe(result=>
      {
        this.compra = result;
        
        this.listaCompraDetalhe = result.listaCompraDetalhe;

        this.listaCompraDetalhe.forEach(detalhe=>{
          this.inscricao$ = this.produtoService.get<Produto>(detalhe.codigoProduto).subscribe(result=>{
              detalhe.produto = {codigo: result.codigo, nome : result.nome} as Produto;
            }
          );
          
        });          
        
      },error=>{
        console.log(error);
        this.handleError('Ocorreu um erro ao consultar os dados da compra.');
      });
    }
  }
  
}
