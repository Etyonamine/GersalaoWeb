import { NgModule } from "@angular/core";
import { FormsModule,ReactiveFormsModule } from "@angular/forms";
import { AgendaServicoEditComponent } from './agenda-servico-edit/agenda-servico-edit.component';
import { MaterialModule } from "../material/material.module";
import { SharedModule } from '../shared/shared.module';

@NgModule({
    declarations:[
    AgendaServicoEditComponent
  ] ,
  imports:[
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    SharedModule
  ]
})
export class AgendaServicosModule { }