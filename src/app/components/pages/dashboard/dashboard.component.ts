import { Component, OnInit } from '@angular/core';
import {DarkModeService} from "../../../services/dark-mode.service";
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../../environments/environment";

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  nome = "";
  saudacao = "";
  carregamento = {
    carregando:true,
    sucesso:true
  }
  private readonly backendUrl:string;
  constructor(
    public darkMode:DarkModeService,
    private http:HttpClient
  ) {
    this.backendUrl = environment.backendUrl;
  }
  // TODO: fazer requisição de Back-End e implementar nesta página!
  ngOnInit(): void {
    this.saudacao = this.obterSaudacao();
  }

  obterUsuario(){
    let usuarioLogadoJWT = "";
    this.http.get(this.backendUrl + '',{
      headers:{
        'authorization':'basic ' + usuarioLogadoJWT
      }
    }).subscribe({
      next: dados => {
        this.carregamento.sucesso = true;
        this.carregamento.carregando = false;
      },
      error: err => {
        console.log(err);
        this.carregamento.sucesso = false;
        this.carregamento.carregando = false;
      },
      complete: ()=>this.carregamento.carregando = false
    })
  }

  obterSaudacao(){
    const data = new Date();
    const hora = data.getHours();
    const min = data.getMinutes();
    let saudacao;
    if((hora >= 5 && (min >= 30 && min <= 59)) && (hora<= 11 && (min >= 0 && min <= 59))) // Amanhecendo a partir das 5:30 até meio-dia
      saudacao = "Bom dia"
    else if((hora >= 12 && (min >= 0 && min <= 59)) && (hora<= 17 && (min >= 0 && min <= 59))) // tarde toda
      saudacao = "Boa tarde"
    else if( // Abaixo a decisão entre a noite e a madrugada
      ((hora >= 0 && (min >= 0 && min <= 59)) && (hora<= 5 && (min >= 0 && min <= 29))) || // Madrugada
      ((hora >= 18 && (min >= 0 && min <= 59)) && (hora<= 23 && (min >= 0 && min <= 59))) // Noite
    )
      saudacao = "Boa Noite"
    else
      saudacao = "";
    return saudacao;
  }
}
