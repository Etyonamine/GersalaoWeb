import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/auth-guard/auth.service';
import { ProfissionalReportService } from '../profissional-report.service';

@Component({
  selector: 'app-profissional-report',
  templateUrl: './profissional-report.component.html',
  styleUrls: ['./profissional-report.component.scss']
})
export class ProfissionalReportComponent implements OnInit {
  nomeUsuario : string ='';
  type = 'application/pdf' ;
  inscricao$:Subscription;
  inscricaoAuth$:Subscription;

  constructor(private authService : AuthService,
              private profissionalReportService: ProfissionalReportService) { }

  ngOnInit(): void {
    this.nomeUsuario = this.authService.usuarioLogado.login;
  }
  
  ngOnDestroy(): void {
    if (this.inscricao$){
      this.inscricao$.unsubscribe();
    }
    if (this.inscricaoAuth$){
      this.inscricaoAuth$.unsubscribe();
    }
  }

  gerarRelatorio(){
    this.inscricao$ = this.profissionalReportService.gerarLista(this.nomeUsuario).subscribe(respData => {
      this.downLoadFile(respData, this.type);
    },error=>{
      console.log(error);
    }
    );
  }

   /**
 * Method is use to download file from server.
 * @param data - Array Buffer data
 * @param type - type of the document.
 */
    downLoadFile(data: any, type: string) {
      var blob = new Blob([data], { type: type.toString() });
      var url = window.URL.createObjectURL(blob);
      var pwa = window.open(url);
      if (!pwa || pwa.closed || typeof pwa.closed == 'undefined') {
          alert('Por favor, desbloquear o pop-up e tentar novamente.');
      }
    }

}
