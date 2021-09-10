import { Endereco } from "src/app/endereco/endereco";

export interface ProfissionalEndereco
{
  CodigoProfissional : number;
  CodigoEndereco: number;
  CodigoUsuarioCadastro : number;
  DataCadastro : Date;
  endereco:Endereco;
}
