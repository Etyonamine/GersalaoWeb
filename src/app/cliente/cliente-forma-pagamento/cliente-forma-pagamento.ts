import { FormaPagamento } from "src/app/forma-pagamento/forma-pagamento";

export interface ClienteFormaPagamento{
    codigoCliente: number;
    codigoFormaPagto: number;
    valor: string;
    observacao: string;
    dataCadastro: Date;
    codigoUsuarioCadastro: number;
    formaPagamento: FormaPagamento;
}