import { ThrowStmt } from '@angular/compiler';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/auth-guard/auth.service';
import { CompraDetalhe } from 'src/app/compra-detalhe/compra-detalhe';
import { Produto } from 'src/app/produto/produto';
import { ProdutoService } from 'src/app/produto/produto.service';
import { AlertService } from 'src/app/shared/alert/alert.service';
import { BaseFormComponent } from 'src/app/shared/base-form/base-form.component';
import { ApiResult } from 'src/app/shared/base.service';
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
  valorDigitado: number = 0;
  valorTotalProdutoAdd = 0;

  produtos:Array<Produto>;  
  listaCompraDetalhe: Array<CompraDetalhe>=[];
  inscricao$ : Subscription;

  codigoProdutoAdd : number = 0;
  quantidadeProdutoAdd: number = 0;
  valorUnitarioAdd: number = 0;

  date = new FormControl(new Date());
  serializedDate = new FormControl(new Date().toISOString());
  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router,
    private serviceAlert:AlertService,
    private produtoService: ProdutoService
  ) 
  {
    super();
  }

  ngOnInit(): void {
    this.compra = this.route.snapshot.data['compra']=== undefined?{codigo : null, dataCompra : null, valor: null, dataVenctoBoleto : null, dataPagtoBoleto:null, observacao: null}:this.route.snapshot.data['compra'];
    this.criacaoFormulario();
    this.listaProdutos();
    }
  ngOnDestroy():void{

    if(this.inscricao$){
      this.inscricao$.unsubscribe();
    }
  }
  criacaoFormulario(){
    //formulario cliente
    this.formulario = this.formBuilder.group({
      codigo: [{value:this.compra.codigo, disabled:true}],
      valor: [{value:null,disabled:true},Validators.required],
      dataCompra: [this.compra.dataCompra === null? new Date:this.compra.dataCompra, [Validators.required]],      
      dataVenctoBoleto:[this.compra.dataVenctoBoleto === null?new Date: this.compra.dataVenctoBoleto,[Validators.required]],
      dataPagtoBoleto:[{value:this.compra.dataPagtoBoleto,disabled:true}],
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
    console.log(this.compra);

  } 
  retornar()
  {
    
  }
  handleError(msg:string)
  {
    this.serviceAlert.mensagemErro(msg);
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
    let index  = this.listaCompraDetalhe.findIndex(x=>x.codigoProduto == this.codigoProdutoAdd);

    if (index !== -1){
        this.listaCompraDetalhe.find(x=>x.codigoProduto == this.codigoProdutoAdd).quantidadeProduto += this.quantidadeProdutoAdd;
    }else{
      let produtoSelecionado = this.produtos.find(x=>x.codigo == this.codigoProdutoAdd);

      const produtoAdicionar = {
        codigo : this.codigo,
        codigoProduto : this.codigoProdutoAdd,
        quantidadeProduto : this.quantidadeProdutoAdd,
        valorUnitario : this.valorUnitarioAdd, 
        produto : <Produto>{codigo : this.codigoProdutoAdd,
        nome :  produtoSelecionado.nome}
      } as CompraDetalhe;
  
     this.listaCompraDetalhe.push(produtoAdicionar);
    }
    //somando valores
    let total = this.listaCompraDetalhe.reduce((sum,current) => sum + current.valorUnitario,0);
    console.log(total);
   // this.formulario.controls['valor'].setValue(this.valorTotalProdutoAdd);
    //limpando os campos
    this.codigoProdutoAdd = 0;
    this.quantidadeProdutoAdd = null;
    this.valorUnitarioAdd = null;

   
  
  }
}
