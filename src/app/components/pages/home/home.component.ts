import {Component, Inject, OnInit} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {DarkModeService} from "../../../services/dark-mode.service";
import {embaralharMatriz} from 'src/app/services/funcoesDiversas';
import { CarrosselHome } from 'src/app/Models/CarrosselHome.Model';
import {CursoModel} from "../../../Models/Curso.Model";
import {environment} from "../../../../environments/environment";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  data = {
    fotos:new ObterDadosModelo(),
    cursos:new ObterDadosModelo()
  };
  gotDataSuccessFotos:CarrosselHome[] = [];
  gotCursos:CursoModel[] = [];
  public baseUrl: string;
  public backendUrl: string;

  constructor(
    private httpClient:HttpClient,
    public darkMode:DarkModeService
  ) {
    this.baseUrl = environment.baseUrl;
    this.backendUrl = environment.backendUrl;
  }

  ngOnInit(): void {
    this.obterTodasFotosCarrossel();
    this.obterAlgunsCursos();
  }

  readonly atribuirUrl = (url:string) => url.replace('@baseUrl%/',this.baseUrl);

  //TODO:Remover a API fake e colocar o back-end do carrossel correto
  private obterTodasFotosCarrossel(){
    this.data.fotos.getting = true;
    this.httpClient
      .get<CarrosselHome[]>(this.baseUrl + 'assets/API/carrosselHome.json')
      .subscribe({
        next:res => {
          this.data.fotos.success = true;
          this.gotDataSuccessFotos.splice(0);
          res.forEach(val=>this.gotDataSuccessFotos.push(val));
        },
        error:err => {
          this.data.fotos.error = true;
          console.log("Um erro foi ocorrido: ", err);
        },
        complete: () => this.data.fotos.getting = false
      });
  }

  private obterAlgunsCursos(){
    this.httpClient
      .get<CursoModel[]>(
        this.backendUrl + '/site/cursos', {
          params: {
            id: 'qualquer',
            limite: 5
          }
        }
      )
      .subscribe({
        next:res => {
          this.data.cursos.success = true;
          this.gotCursos.splice(0);
          for (let indice = 0; indice < res.length; ++indice) {
            if (res[indice].descontinuado)
              continue;
            this.gotCursos.push(res[indice]);
            if (indice >= 5)
              break;
          }
          this.data.cursos.getting = false;
        },
        error:err => {
          this.data.cursos.error = true;
          console.log("Um erro foi ocorrido: ", err);
        },
        complete: () => this.data.cursos.getting = false
      });
  }
}

class ObterDadosModelo{
  public getting=true;
  public error=false;
  public success=false;
}
