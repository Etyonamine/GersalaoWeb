import { AgendaServicoProfissional } from "./agendaServicoProfissional";

export interface AgendaServicoCancelarGravar{
    codigoAgenda: number;
    codigoUsuarioCancelamento:number;
    listaServicosIn: Array<AgendaServicoProfissional>;
}