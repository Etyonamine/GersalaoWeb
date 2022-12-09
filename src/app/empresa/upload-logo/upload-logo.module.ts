import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UploadLogoComponent } from './upload-logo.component';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  declarations: [UploadLogoComponent],
  imports: [
    CommonModule,
    SharedModule
  ]
})
export class UploadLogoModule { }
