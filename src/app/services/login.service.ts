// Arquivo: src/app/services/login.service.ts
import { Inject, Injectable } from "@angular/core";
import { UserDataModel } from '../Models/UserData.Model';
import { HttpClient } from '@angular/common/http';
import { Router } from "@angular/router";
import { CarrinhoService } from "./carrinho.service";
import { DarkModeService } from "./dark-mode.service";
import { LoginResultBackend } from '../Models/LoginResultBackend';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  private backendUrl: string;

  constructor(
    private http:HttpClient,
    private router:Router,
    private darkMode:DarkModeService,
    private carrinho:CarrinhoService,
    @Inject('BASE_URL') baseUrl: string,
    @Inject('BACKEND_URL') backendUrl: string
  ) { this.backendUrl = backendUrl; }
  /**
   * O objeto de usuário base, para ser utilizado nos métodos desta classe. <br>
   * Para evitar qualquer probleba, utilize um dos exemplos abaixo
   * @example```typescript
   * // #1 Apresentando Null Safe Operator:
   * // Utilizando o "?" entre o "usuario" e a propriedade da classe.
   * // Isso garantirá que a aplicação NÃO irá falhar, mesmo que este esteja nulo.
   * this.usuario?.User?.nome = "Fulano";
   * this.usuario?.User?.sobrenome = "de Tal";
   *
   *  // #2 Apresentando o operador "??":
   *  // Se este campo for nulo, então instancia uma nova classe 'UserDataModel.
   *  let usuario = this.usuario ?? new UserDataModel();
   *
   *  // #3 Aprenetando o operador "!!"
   *  // Ideal para utilizar dentro de IFs, para garantir que o valor não seja nulo.
   *  let usuario = this.usuario;
   *  if(!!usuario){
   *    console.log("O objeto usuário não é nulo");
   *  } else {
   *    console.log("O objeto usuário é nulo");
   *  }
   * ```
   */
  private usuario?: UserDataModel;
  private jwt?: string;
  private validadeLogin?: Date;
  /**
   * Verifica se existe algum token armazenado no localStorage ou usuário instanciado...
   */
  public get existeLogin():boolean {
    if(typeof(window) !== 'undefined')
      return (
        localStorage.getItem('token') !== null &&
        localStorage.getItem('vencimento') !== null
      ) // na linha abaixo: !! significa que NÃO é nulo e NEM indefinido
        || !!this.usuario || !!this.jwt || !!this.validadeLogin;
    else
      return !!this.usuario;
  }

  /**
   * Retorna o objeto do usuário logado, com as devidas informações preenchidas
   * @returns {UserDataModel|undefined}
   */
  public get Usuario(){ return this.usuario; }

  /**
   * Define manualmente o usuário logado
   * @param value O objeto do usuário
   * @returns void
   * @throws Error: se o valor passado for `null` ou `undefined`.
   */
  public set Usuario(value){
    if(typeof(value) === 'undefined' || value === null)
      throw Error("The value mustn't be undefined or null!");
    this.usuario = value;
  }

  /**
   * Apenas preenche o local storage com o token e o vencimento.
   * @param jwt O token JWT obtido do backend.
   * @param validade A data de vencimento do Token (data em que, até quando o usuário permanecerá logado).
   * @param usuario O objeto com as informações do usuário logado.
   * @return void
   */
  fazerLogin(jwt: string, validade:Date, usuario?:UserDataModel) {
    localStorage?.setItem("token", jwt);
    localStorage?.setItem("vencimento", validade.toString());
    this.jwt = jwt;
    this.validadeLogin = validade;
    this.usuario = usuario;
  }

  /**
   * Se voltar `true`, ainda está dentro do prazo de validade<br>
   * Se voltar `false`, o token expirou, limpa do LocalStorage e o usuário deve fazer login novamente.
   * @return boolean
   */
  checkValidade() {
    let strValidade = localStorage?.getItem('vencimento') ?? '';
    let dataValidade = strValidade !== null ? new Date(strValidade) : this.validadeLogin;
    let hoje = new Date();
    // O !! é para transformar de `object` em `boolean`. Se não for *null* ou *undefined*, então é *true*!
    if (!!dataValidade && dataValidade < hoje) {
      this.encerrarSecao();
      return false;
    }
    return true;
  }

  /**
   * Obtém o usuário logado (se existir) e preenche o `this.Usuario` com as informações obtidas no Back-end.
   * @return void
   */
  getUsuarioLogado(callbackSuccess?: ((usuario:UserDataModel) => void)) {
    if(!this.darkMode.suporteDarkMode)
      return;
    if(!this.existeLogin) {
      if(!!callbackSuccess)
        callbackSuccess(this?.usuario ?? new UserDataModel());
      return;
    }
    let tokenJWT = localStorage.getItem('token') ?? '';
    this.http.get<{codigo:number,dados:UserDataModel}>(this.backendUrl + '/usuarios/obter-usuario',{
      headers: { Authorization: `Bearer ${tokenJWT}` }
    }).subscribe({
      next: result => {
        this.usuario = result.dados;
        if(!!callbackSuccess)
          callbackSuccess(result.dados);
      },
      error: erro => console.log(erro)
    });
  }

  /**
   * Encerra a sessão do usuário, limpa o localStorage e o objeto `this.Usuario`.
   * @return void
   */
  async encerrarSecao() {
    if(this.darkMode.suporteDarkMode) {
      localStorage.removeItem("token");
      localStorage.removeItem("vencimento");
    }
    this.carrinho.cursos.splice(0);
    this.usuario = undefined;
    this.jwt = undefined;
    this.validadeLogin = undefined;
    await this.router.navigate(['login','']);
  }


  fazerLoginBackend(usuario:string,senha:string) {
    if (!this.darkMode.suporteDarkMode)
      return;
    let dados = new FormData();
    dados.append('usuario', usuario);
    dados.append('senha', senha);
    return this.http.post<LoginResultBackend>(
      this.backendUrl + '/usuarios/login',
      dados,
      { responseType: "json" }
    );
  }
}
