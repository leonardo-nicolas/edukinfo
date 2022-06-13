//Arquivo: src/app/components/pages/login/recupera-senha/recupera-senha.component.ts

import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, Inject, Input, OnInit, Output } from '@angular/core';
import { DarkModeService } from 'src/app/services/dark-mode.service';

@Component({
  selector: 'app-recupera-senha',
  templateUrl: './recupera-senha.component.html',
  styleUrls: ['./recupera-senha.component.scss']
})
export class RecuperaSenhaComponent implements OnInit {

  constructor(
    private http: HttpClient,
    public darkMode: DarkModeService,
    @Inject('BACKEND_URL') private backendUrl: string
  ) { }

  @Input()
  email: string = "";
  @Output()
  emailChange = new EventEmitter<string>();


  ngOnInit() { }

  msgAlerta?: string;
  tipoAlerta?: string;
  exibeAlerta = false;
  carregando = false;
  recuperarSenha() {
    this.carregando = true;
    let dados = new FormData();
    dados.append('email', this.email);
    this.http
      .post<{codigo:number,mensagem:string}>(
        this.backendUrl + '/usuarios/recuperar-senha',
        dados,
        {}
      ).subscribe({
      next: retorno => {
          this.tipoAlerta = retorno.codigo !== 200 ? 'warning' : 'success';
          this.exibeAlerta = true;
          this.msgAlerta = retorno.mensagem;
          this.carregando = false;
      },
      error:err=> {
        console.log(err);
        this.msgAlerta = "Houve um erro crítico inesperado.";
        this.msgAlerta = "Tente novamente mais tarde!";
        this.tipoAlerta = "danger";
        this.exibeAlerta = true;
        this.carregando = false;
      },
      complete:()=>{this.carregando = false;}
    });
  }

  fechaAlerta() {
    this.exibeAlerta = false;
    this.tipoAlerta = undefined;
    this.msgAlerta = undefined;
  }
}
