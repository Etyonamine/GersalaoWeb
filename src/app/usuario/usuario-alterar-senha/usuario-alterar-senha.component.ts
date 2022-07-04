import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { BaseFormComponent } from 'src/app/shared/base-form/base-form.component';
import { Usuario } from '../usuario';

@Component({
  selector: 'app-usuario-alterar-senha',
  templateUrl: './usuario-alterar-senha.component.html',
  styleUrls: ['./usuario-alterar-senha.component.scss']
})
export class UsuarioAlterarSenhaComponent extends BaseFormComponent implements OnInit {
  submit() {
    throw new Error('Method not implemented.');
  }
  usuario : Usuario ;
  formulario:FormGroup;
  hide = true;
  
  constructor(private route: ActivatedRoute,
              private formBuilder: FormBuilder) { super(); }
  
  ngOnInit(): void {
    this.usuario = this.route.snapshot.data['usuario'];
    this.criacaoFormulario();
  }
  criacaoFormulario(){
    let dataBoleto = new Date();
    dataBoleto.setDate(dataBoleto.getDate()+30);
    //formulario cliente
    this.formulario = this.formBuilder.group({
      novaSenha: [null, Validators.required],
      repetirSenha: [null, Validators.required]
    });
  }
}
