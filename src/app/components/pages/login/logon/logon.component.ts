// Arquivo: src/app/components/pages/login/logon/logon.component.ts

import { Component, EventEmitter, Inject, Input, OnInit, Output, ViewEncapsulation } from "@angular/core";
import { DarkModeService } from "../../../../services/dark-mode.service";
import { HttpClient } from '@angular/common/http';
import { LoginService } from '../../../../services/login.service';
import { Router } from "@angular/router";

@Component({
  selector: 'app-logon',
  templateUrl: './logon.component.html',
  styleUrls: ['./logon.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class LogonComponent implements OnInit {

  constructor(
    public darkMode: DarkModeService,
    private http: HttpClient,
    private loginService: LoginService,
    private router:Router,
    @Inject('BACKEND_URL') private backendUrl: string
  ) {
    this.fazendoLogin = new EventEmitter<() => void>(false);
    this.fazendoLogin.subscribe(this.clickBtnLogin);
   }


  @Input()
  usuario="";
  @Output()
  usuarioChange = new EventEmitter<string>();


  @Input()
  senha="";
  @Output()
  senhaChange = new EventEmitter<string>();


  @Output()
  fazendoLogin: EventEmitter<() => void>;

  clickBtnLogin = () => {
    if (!this.darkMode.suporteDarkMode)
      return;

  };

  @Input()
  clickBotaoEnvio?:()=>void;

  @Input("rotinaReset")
  clickBotaoReset?: ()=>void;

  _msgErro="";
  @Input("mensagemErro")
  set msgErro(value:string|undefined){
    this._msgErro = value ?? '';
  }

  @Input("tipoErroAlerta")
  tipoAlerta?:string;

  @Input("tempoFecharMsgEmSeg")
  tempoDismissAlerta = 0;

  ngOnInit() {

  }

  fechaMsgErro() {
    this.msgErro = undefined;
    this.existeErro = undefined;
  }

  existeErro?: boolean;
  carregando = false;
  clickLogin() {
    this.carregando = true;
    this.loginService.fazerLoginBackend(this.usuario, this.senha)?.subscribe({
      next: resposta => {
        this.carregando = false;
        if (!!resposta.codErro && !!resposta.mensagem) {
          this.existeErro = true;
          this._msgErro = resposta.mensagem;
          this.tipoAlerta = 'warning';
          return;
        }
        if (!!resposta.jwt && !!resposta.validade)
          this.loginService.fazerLogin(resposta.jwt, resposta.validade, resposta.usuario);
        this._msgErro = "";
        this.router.navigate([ '/dashboard' ]);
      },
      error: err => { console.log(err); this.carregando = false; },
      complete: () => { this.carregando = false; }
    });
  }

}
