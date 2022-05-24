import { Component, OnInit } from '@angular/core';
import { DarkModeService } from 'src/app/services/dark-mode.service';
import {ActivatedRoute, Router} from "@angular/router";
import {HttpClient} from "@angular/common/http";
import { environment } from '../../../../environments/environment';
import {UserDataModel} from 'src/app/Models/UserData.Model';
import {LoginService} from "../../../services/login.service";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  //TODO:Implementar chamada de API para Login e para Recuperar Senha, além de Reset de form...
  secRecuperarSenha = false;
  loginComErro = false;
  backendUrl: string;
  mensagemErro: string = "";
  recuperarSenhaEnviada: boolean = false;
  constructor(
    private activatedRoute:ActivatedRoute,
    private router:Router,
    private http:HttpClient,
    public darkMode: DarkModeService,
    private loginService:LoginService
  ) { this.backendUrl = environment.backendUrl; }
  ngOnInit(): void {
    this.checagemDeRotas()
  }

  checagemDeRotas(){
    const route = this.activatedRoute.snapshot.paramMap.get('secao');
    switch (route) {
      case 'recuperarSenha':
        this.secRecuperarSenha = true;
        break;
      case null:
      case undefined:
      case '':
        this.secRecuperarSenha = false;
        break;
      default:
        this.router.navigate(['/404']);
    }
  }

  enviarForm() {
    if (!this.secRecuperarSenha) // fazer login normal
      this.fazerLogin();
    else //recuperar senha
      this.recuperarSenha();
  }

  private fazerLogin() {
    let dados = new FormData();
    dados.append('usuario', '' + (document.getElementById('fieldUsuario') as HTMLInputElement)?.value)
    dados.append('senha', '' + (document.getElementById('fieldSenha') as HTMLInputElement)?.value);
    this.http.post<{
      jwt: string | undefined,
      validade: Date | undefined,
      usuario: UserDataModel | undefined
      codErro: number | undefined,
      mensagem: string | undefined
    }>(this.backendUrl + '/usuarios/login', dados, {
      responseType:"json"
    }).subscribe({
      next: resposta => {
        if(!!resposta.codErro && !!resposta.mensagem){
          this.mensagemErro = resposta.mensagem;
          this.loginComErro = true;
          return;
        }
        if (!!resposta.jwt && !!resposta.validade)
          this.loginService.fazerLogin(resposta.jwt,resposta.validade,resposta.usuario);
        this.loginComErro = false;
        this.router.navigate(['/dashboard']);
      },
      error:err=>console.log(err)
    });
  }

  private recuperarSenha() {

  }
}
