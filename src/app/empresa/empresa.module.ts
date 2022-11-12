import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UploadLogoModule } from './upload-logo/upload-logo.module';
import { SharedModule } from '../shared/shared.module';
import { EmpresaComponent } from './empresa.component';
import { EmpresaRoutingModule } from './empresa-routing.module';

@NgModule({
  declarations: [  
    EmpresaComponent     
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    UploadLogoModule,
    SharedModule,
    EmpresaRoutingModule
  ]
})
export class EmpresaModule { }
