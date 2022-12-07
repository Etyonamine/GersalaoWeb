import { ProfissionalContato } from './profissional-contato/profissional-contato';
import { ProfissionalDocumento } from './profissional-documento/profissional-documento';
import { ProfissionalEndereco } from './profissional-endereco/profissional-endereco';
import { TipoServico } from '../tipo-servico/tipo-servico';
import { Situacao } from '../situacao/situacao';

export interface Profissional{
  codigo: number;
  codigoUsuarioCadastro: number;
  codigoUsuarioAlteracao: number;
  codigoSituacao: number;
  codigoTipoServico: number;
  nome: string;
  dataAniversario: Date;
  dataAlteracao: Date;
  dataCadastro: Date;
  observacao: string;
  profissionalContato: ProfissionalContato;
  profissionalDocumento: ProfissionalDocumento;
  profissionalEndereco: ProfissionalEndereco;    
  TipoServico: Array<TipoServico>;
  Situacao: Situacao;
}
 