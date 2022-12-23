export class AgendaBaixa {
    codigo : number;
    codigoFormaPagamento:number;
    data: Date;
    dataString: string;
    dataBaixa: Date;
    hora: string;
    nomeCliente: string;
    nomeProfissional: string;
    descricaoServico: string;    
    valorServico:number;
    valorDesconto:number;
    valorAcrescimo: number;
    valorComissao:number;
    observacao : string;
    observacaoBaixa: string;
    codigoUsuarioAlteracao:number;
    dataUsuarioAlteracao:Date;
    nomeUsuarioBaixa: string;
    situacaoBaixado: boolean;
    situacaoCancelado: boolean;

}