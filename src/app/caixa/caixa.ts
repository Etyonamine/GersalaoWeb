import { Usuario } from "../usuario/usuario";
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
    observacaoFechamento: string;
    caixaDetalhe: CaixaDetalhe[];
    usuarioAbertura: Usuario;
    usuarioFechamento: Usuario;
}