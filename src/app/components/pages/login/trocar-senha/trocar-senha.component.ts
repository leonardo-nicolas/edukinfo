// Arquivo: src/app/components/pages/login/trocar-senha/trocar-senha.component.ts
import { HttpClient } from '@angular/common/http';
import { Component, Inject, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserDataModel } from 'src/app/Models/UserData.Model';
import { DarkModeService } from 'src/app/services/dark-mode.service';

@Component({
  selector: 'app-trocar-senha',
  templateUrl: './trocar-senha.component.html',
  styleUrls: ['./trocar-senha.component.scss']
})
export class TrocarSenhaComponent implements OnInit {

  constructor(
    private router: Router,
    private http: HttpClient,
    public darkMode: DarkModeService,
    @Inject('BACKEND_URL') private backendUrl: string
  ) { }

  @Input()
  token = "";

  ngOnInit() {
    this.getDadosByToken(this.token);
  }
  carregandoDados = true;


  resetarSenha() {
    let formData = new FormData();
    formData.append('senha', this.senhaNova.senha);
    formData.append('token', this.token);
    this.recuperandoSenha = true
    this.http.post<{ codigo: number, mensagem: string }>(
      this.backendUrl + '/usuarios/recuperar-senha',
      formData
    ).subscribe({
      next: resposta => {
        let erroToken = [ 403, 404 ];
        if (erroToken.some(cod => cod === resposta.codigo)) {
          this.erroDeToken = true;
          this.tipoAlerta = 'warning';
          this.msgObtida = resposta.mensagem ?? "";
        } else if (resposta.codigo === 200) {
          this.senhaTrocadaSucesso();
        }
        this.recuperandoSenha = false;
      },
      error: err => {
        console.log(err);
        this.msgObtida = 'Ocorreu um erro desconhecido ao tentar' +
          ' resetar a senha...';
        this.msgObtida += ' Por favor, atualize a página';
        this.msgObtida += ' e tente novamente!';
        this.tipoAlerta = 'danger';
      }
    });
  }

  public senhaTrocada = false;
  private senhaTrocadaSucesso() {
    setTimeout(() => {
      this.router.navigate(['login']);
    }, 15000);
    this.senhaTrocada = true;
  }

  public get senhaAtendeRequisitos() {
    let rxTeste = new RegExp(this.regexTesteSenha);
    return rxTeste.test(this.senhaNova.senha) &&
      this.senhaNova.senha === this.senhaNova.confirmarSenha;
  }
  usuarioParaRecuperarSenha?: string;
  validacaoSenha = {
    "num": false,
    "spec": false,
    "lwr": false,
    "uppr": false,
    "iguais": false,
    "entre7e15": false
  }
  erroDeToken?: boolean;
  msgObtida = "";
  tipoAlerta = "";
  recuperandoSenha = false;
  erroDesconhecido = false;
  private getDadosByToken(token: string) {
    this.http.get<UsuarioOuNulo>(
      this.backendUrl + '/usuarios/obter-usuario',
      { params: { 'token': token } }
    ).subscribe({
      next: resposta => {
        let codErrosToken = [ 403, 404 ];
        this.erroDesconhecido = false;
        if (codErrosToken.some(cod => cod === resposta.codigo)) {
          this.erroDeToken = true;
          this.msgObtida = resposta.mensagem ?? "";
          this.usuarioParaRecuperarSenha = resposta.dados?.usuario?.nome;
          this.tipoAlerta = "warning";
        } else if (resposta.codigo === 200) {
          this.erroDeToken = undefined;
          this.usuarioParaRecuperarSenha = resposta.dados?.usuario?.nome;
        } else if (resposta.codigo === 400) {
          this.erroDesconhecido = true;
        }
        console.log(resposta);
      },
      error: err => {
        console.log(err);
        this.erroDeToken = undefined;
        this.msgObtida = "Ocorreu um erro desconhecido ao tentar";
        this.msgObtida += " obter os dados do usuário...";
        this.msgObtida += " Por favor, atualize a página";
        this.msgObtida += " e tente novamente!";
        this.erroDesconhecido = true;
      }
    });
  }
  senhaNova = {
    senha: '',
    confirmarSenha: ''
  };

  private regexPartesSenha = {
    num: /(?=.*\d)/,
    specChr: /(?=.*[\[\]\-\/\\$*=_{}'%`´^~:;.,?!¡¿<>ªº°®ŧ←↓→øþĸŋđðßæ«»©“”nµ─·|+&@#ƒ„…†‡ˆ‰Š‹ŒŽ•–—š›œžŸ¢£¤¥¦§¨¬¹²³€])/,
    lwr: /(?=.*[a-z])/,
    uppr: /(?=.*[A-Z])/
  };
  get desativaBotaoEnvio(): boolean{
    let condicoes = [
      typeof(this.usuarioParaRecuperarSenha) === "undefined",
      this.erroDeToken || this.erroDesconhecido,
      !this.senhaAtendeRequisitos
    ];
    return condicoes.some(condicao => condicao);
  }

  public get regexTesteSenha() {
    return "(" +
      this.regexPartesSenha.num.source +
      this.regexPartesSenha.specChr.source +
      this.regexPartesSenha.lwr.source +
      this.regexPartesSenha.uppr.source + ")";
  }

  validatePwd() {
    let existeSenha = this.senhaNova.senha !== '';
    let senhaObtida = this.senhaNova.senha;
    this.validacaoSenha.num = existeSenha && this.regexPartesSenha.num.test(senhaObtida);
    this.validacaoSenha.spec = existeSenha && this.regexPartesSenha.specChr.test(senhaObtida);
    this.validacaoSenha.lwr = existeSenha && this.regexPartesSenha.lwr.test(senhaObtida);
    this.validacaoSenha.uppr = existeSenha && this.regexPartesSenha.uppr.test(senhaObtida);
    this.validacaoSenha.iguais = existeSenha &&
      senhaObtida === this.senhaNova.confirmarSenha;
    this.validacaoSenha.entre7e15 = (senhaObtida.length >= 7 && senhaObtida.length <= 15);
  }


}

interface UsuarioOuNulo {
  codigo:number;
  mensagem?:string;
  dados?: UserDataModel;
}
