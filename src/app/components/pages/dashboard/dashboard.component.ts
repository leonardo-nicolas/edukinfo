// Arquivo: src/app/components/pages/dashboard/dashboard.component.ts
import { Component, Inject, OnInit } from "@angular/core";
import {DarkModeService} from "../../../services/dark-mode.service";
import {LoginService} from "../../../services/login.service";

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  carregamento = {
    carregando:true,
    sucesso:false
  }
  constructor(
    public darkMode: DarkModeService,
    public login: LoginService,
    @Inject('BACKEND_URL') private readonly backendUrl: string
  ) { }

  // TODO: fazer requisição de Back-End e implementar nesta página!
  ngOnInit(): void {
    this.obterUsuario();
  }

  obterUsuario(){
    this.carregamento.carregando = true;
    this.login.getUsuarioLogado(usuario => {
      this.carregamento.carregando = false;
      this.carregamento.sucesso = true;
    });
  }

  obterSaudacao(){
    const data = new Date();
    const hora = data.getHours();
    let saudacao = "";
    if(hora >= 0 && hora <= 5 ) //Madrugada
      saudacao = "Boa noite";
    else if(hora >= 6 && hora <= 11) //Manhã
      saudacao = "Bom dia";
    else if(hora >= 12 && hora <= 17) //Tarde
      saudacao = "Boa tarde";
    else if(hora >= 18 && hora <= 23) //Noite
      saudacao = "Boa noite";
    return saudacao;
  }

  dataDeNascimento() {
    let data = this.login?.Usuario?.usuario?.aniversario;
    if (!(data instanceof Date)) data = !!data ? new Date(data) : new Date();
    let dia:number|string = data.getDay();
    dia = dia < 10 ? "0" + dia : dia;
    let mes:string|number = data.getMonth() + 1;
    mes = mes < 10 ? "0" + mes.toString() : mes;
    const ano = data.getFullYear();
    return `${dia}/${mes}/${ano}`;
  }

  formatarTelefone(posicao: number) : string {
    let numero = !!this.login.Usuario ? this.login.Usuario.telefones[posicao].numero : "";
    numero = numero.replace(/\D/g,'');
    let parte1="", parte2="";
    switch(numero.length){
      case 8:
        for(let i = 0; i < 4; i++)
          parte1 += numero.charAt(i);
        for(let i = 4; i < 8; i++)
          parte2 += numero.charAt(i);
        break;
      case 9:
        for(let i = 0; i < 5; i++)
          parte1 += numero.charAt(i);
        for(let i = 5; i < 9; i++)
          parte2 += numero.charAt(i);
        break;
      default: return numero;
    }
    return `${parte1}-${parte2}`;
  }
}
