import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DocumentoFormComponent } from './documento-form/documento-form.component';
import { MaterialModule } from '../material/material.module';
import { DocumentoDialogComponent } from './documento-dialog/documento-dialog.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
@NgModule({
  declarations: [
    DocumentoFormComponent,
    DocumentoDialogComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class DocumentoModule { }
