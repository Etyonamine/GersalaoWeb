import { Endereco } from "src/app/endereco/endereco";
import { Profissional } from "../professional";

export interface ProfissionalEndereco
{
  codigoProfissional : number;
  codigoEndereco: number;  
  endereco:Endereco;
  codigoUsuarioCadastro: number;
  dataCadastro : Date; 
  
}
