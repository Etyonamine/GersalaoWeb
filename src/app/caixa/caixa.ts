import { CaixaDetalhe } from "./caixa-detalhe";

export class Caixa{
    codigo: number;
    dataAbertura: Date;
    dataFechamento: Date;
    codigoUsuarioAbertura: number;    
    codigoUsuarioFechamento: number;
    valorInicial:number;
    valorFinal: number;    
    observacao: string;
    caixaDetalhe: CaixaDetalhe[];
}