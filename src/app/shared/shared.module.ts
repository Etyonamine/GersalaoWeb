import { MaterialModule } from './../material/material.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AlertComponent } from './alert/alert.component';
import { MsgErrorComponent } from './msg-error/msg-error.component';
import { FormDebugComponent } from './form-debug/form-debug.component';
import { AlertConfirmComponent } from './alert/alert-confirm/alert-confirm.component';


@NgModule({
  declarations: [
    AlertComponent,
    AlertConfirmComponent,
    MsgErrorComponent,
    FormDebugComponent

  ],
  imports: [
    CommonModule,
    MaterialModule
  ],
  exports: [
    MaterialModule,
    MsgErrorComponent,
    FormDebugComponent
  ],
  entryComponents: [AlertComponent, AlertConfirmComponent]
})
export class SharedModule { }
