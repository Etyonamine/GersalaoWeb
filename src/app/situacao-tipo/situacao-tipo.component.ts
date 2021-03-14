import { MatTableDataSource } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { Component, OnInit } from '@angular/core';
import { SituacaoTipo } from './situacaoTipo';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-situacao-tipo',
  templateUrl: './situacao-tipo.component.html',
  styleUrls: ['./situacao-tipo.component.css']
})
export class SituacaoTipoComponent {
  //public situacaoTipos:SituacaoTipo[];
  public situacaoTipos: MatTableDataSource<SituacaoTipo>;
  public colunas: string[]=['codigo','descricao','dataCadastro' ];

  constructor(private http:HttpClient) { }
 
  ngOnInit(){
    var url='https://localhost:44314/api/situacaoTipos'
    this.http.get<SituacaoTipo[]>(url)
        .subscribe(result=>{
          this.situacaoTipos = new MatTableDataSource<SituacaoTipo>(result);
        });
  }
}
