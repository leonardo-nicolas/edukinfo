import { HttpClient } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CursoModel } from '../../../Models/Curso.Model';
import { DarkModeService } from 'src/app/services/dark-mode.service';
import {environment} from "../../../../environments/environment";

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit {

  keywordSearch = "";
  private readonly baseUrl: string;
  private readonly backendUrl: string;

  constructor(
    private activatedRoute: ActivatedRoute,
    public darkMode: DarkModeService,
    private http:HttpClient
  ) {
    this.baseUrl = environment.baseUrl;
    this.backendUrl = environment.backendUrl;
  }

  carregamento = {
    concluido: false,
    comErro:false
  }

  buscaCursos: CursoModel[] = [];

  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe(params => {
      this.keywordSearch = params['q'] ?? this.keywordSearch;
      this.buscarCursosAPI(this.keywordSearch);
    });
  }

  private buscarCursosAPI(palavraChave: string) {
    this.carregamento.concluido = false;
    this.http.get<CursoModel[]>(
      this.backendUrl + "/site/cursos", {
        params: {
          q:palavraChave
        }
      }
    )
    .subscribe({
      next: cursosObtidos => {
        this.buscaCursos.splice(0);
        cursosObtidos.forEach(v => {
            this.buscaCursos.push(v);
        });
        this.carregamento.comErro = false;
        this.carregamento.concluido = true;
      },
      error: err => {
        console.log(err);
        this.carregamento.comErro = true;
        this.carregamento.concluido = true;
      },
      complete: () => {
        this.carregamento.concluido = true;
      }
    });
  }


  readonly atribuirUrl = (url: string) => url.replace("@baseUrl%/", this.baseUrl);
}
