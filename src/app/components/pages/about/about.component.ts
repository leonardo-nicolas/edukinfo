import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { DarkModeService } from "../../../services/dark-mode.service";
import { ActivatedRoute, Router } from "@angular/router";
import { TabDirective, TabsetComponent } from "ngx-bootstrap/tabs";
import { HttpClient } from "@angular/common/http";
import {FaqModel, LinhaDoTempoModel, SocioModel} from 'src/app/Models/PaginaSobre.Model';
import { embaralharMatriz } from "../../../services/funcoesDiversas";
import {Address} from "../../../Models/UserData.Model";
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss']
})
export class AboutComponent implements OnInit {

  public baseUrl:string;
  constructor(
    public darkMode:DarkModeService,
    private router:Router,
    private activatedRoute:ActivatedRoute,
    private http:HttpClient
  ) { this.baseUrl = environment.baseUrl; }

  @ViewChild('guiasInstitucional',{static:false})
  private guiasInstitucional?:TabsetComponent;

  ngOnInit(): void {
    this.carregarLinhaDoTempo();
    this.carregarSociosEmpresa();
    this.carregarUnidades();
    this.carregarPerguntasFrequentes();
    this.activatedRoute.paramMap.subscribe(secao=> this.redirecionamentoCerto(secao.get("secao")));
  }
  async redirecionamentoCerto(rota:string|null|undefined){
    if(typeof(rota) === 'string')
      rota = rota.toLowerCase();
    switch(rota){
      case null: case '': case 'nos':
        await this.selecionarGuia(0); break;
      case 'quem-somos':await this.selecionarGuia(1); break;
      case 'missao-visao-valores':await this.selecionarGuia(2); break;
      case 'unidades':await this.selecionarGuia(3); break;
      case 'faq':await this.selecionarGuia(4); break;
      default: await this.router.navigate(['404']); break;
    }
  }

  async aoEscolherGuia(_dados: TabDirective|MouseEvent,idGuia?:number) {
    idGuia = idGuia ?? -1;
    let rotasDeRedirecionamento = ['nos','quem-somos','missao-visao-valores','unidades','faq'];
    await this.router.navigate(['/sobre',rotasDeRedirecionamento[idGuia]]);
    if(typeof(idGuia) !== 'undefined' && idGuia === 1)
      embaralharMatriz(this.sociosDaEmpresa);
    else if(typeof(idGuia) !== 'undefined' && idGuia === 3)
      embaralharMatriz(this.unidades);
    else if(typeof(idGuia) !== 'undefined' && idGuia === 4)
      embaralharMatriz(this.perguntasFrequentes);

  }

  private async selecionarGuia(tabId: number) {
    return new Promise(()=>{
      setTimeout(()=>{
        if (this.guiasInstitucional?.tabs[tabId]) {
          this.guiasInstitucional.tabs[tabId].active = true;
        }
      },100);
    });
  }

  trajetoriasLinhaDoTempo:LinhaDoTempoModel[] = [];
  private carregarLinhaDoTempo() {
    this.http.get<LinhaDoTempoModel[]>(this.baseUrl + 'assets/API/linha-do-tempo.json').subscribe(dados => {
      this.trajetoriasLinhaDoTempo.splice(0);
      dados.forEach(val=>this.trajetoriasLinhaDoTempo.push(val));
    });
  }

  sociosDaEmpresa:SocioModel[] = [];
  private carregarSociosEmpresa(){
    this.http.get<SocioModel[]>(this.baseUrl + 'assets/API/quem-somos.json').subscribe(dados => {
      this.sociosDaEmpresa.splice(0);
      dados.forEach(val=> {
        let data:SocioModel=new class implements SocioModel {
          cargos=val.cargos;
          contribuicao=val.contribuicao;
          foto='@baseUrl%/assets/images/socios-alunos-grupo/'+val.foto;
          matricula=val.matricula;
          nome=val.nome;
        };
        embaralharMatriz(data.cargos);
        this.sociosDaEmpresa.push(data);
      });
      embaralharMatriz(this.sociosDaEmpresa);
    });
  }

  perguntasFrequentes:FaqModel[] = [];
  private carregarPerguntasFrequentes(){
    this.http.get<FaqModel[]>(this.baseUrl + 'assets/API/faq.json').subscribe(dados => {
      this.perguntasFrequentes.splice(0);
      dados.forEach(val=>this.perguntasFrequentes.push(val));
    });
  }

  unidades:Address[] = [];
  private carregarUnidades(){
    this.http.get<Address[]>(this.baseUrl + 'assets/API/unidades.json').subscribe(dados => {
      this.unidades.splice(0);
      dados.forEach(val=>this.unidades.push(val));
    });
    embaralharMatriz(this.unidades);
  }

  readonly atribuirUrl = (url:string) => url.replace('@baseUrl%/',this.baseUrl);

  formataMatricula(matricula: number) {
    let strMatricula = matricula.toString();
    let matriculaFormatada = "";
    let posicaoPontuacoes = [3,5]
    for(let i = 0; i < 12; ++i){
      matriculaFormatada += strMatricula.charAt(i);
      if(posicaoPontuacoes.some(num=>num===i))
        matriculaFormatada += ".";
    }
    return matriculaFormatada;
  }

  preencheCargos(cargos: string[]) {
    let resultado="";
    const totalDoArray = cargos.length;
    cargos.forEach((val,indice)=>{
      resultado += val;
      if(indice < totalDoArray - 1)
        resultado += ", ";
    });
    return resultado;
  }

  formataCep(cep: string) {
    let cepComMascara = "";
    for(let i=0;i<cep.length;i++){
      cepComMascara += cep.charAt(i);
      if(i === 1)
        cepComMascara += ".";
      else if(i === 4)
        cepComMascara += "-";
    }
    return cepComMascara;
  }
}

