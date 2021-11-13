import { Component, OnInit } from '@angular/core';
import { TipoProduto } from './tipo-produto';
import { TipoProdutoService } from './tipo-produto.service';

@Component({
  selector: 'app-tipo-produto',
  templateUrl: './tipo-produto.component.html',
  styleUrls: ['./tipo-produto.component.scss']
})
export class TipoProdutoComponent implements OnInit {

  tipoProdutos: Array<TipoProduto>=[];

  constructor(
    private tipoProdutoService: TipoProdutoService
  ) { }

  ngOnInit(): void {
  }

}
