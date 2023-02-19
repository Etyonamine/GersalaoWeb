import { CaixaTipoLancamento } from "./caixa-tipo-lancamento";

export class CaixaDetalhe{
    codigoCaixa : number;
    codigoTipoLancamento: number; 
    numeroSequencia: number;
    valor: number;
    observacao: string;    
    dataCadastro: Date;
    codigoUsuarioCadastro: number;
    caixaTipoLancamento: CaixaTipoLancamento
}