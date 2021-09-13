import { Endereco } from "src/app/endereco/endereco";
import { Profissional } from "../professional";

export interface ProfissionalEndereco
{
  CodigoProfissional : number;
  CodigoEndereco: number;  
  Endereco:Endereco;
   
  
}
