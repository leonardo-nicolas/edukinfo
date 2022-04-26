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

  constructor(
    private activatedRoute: ActivatedRoute,
    public darkMode: DarkModeService,
    private http:HttpClient
  ) { this.baseUrl = environment.baseUrl; }

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

  //TODO: Implementar pesquisa de palavras-chave POR API de Back-End.
  private buscarCursosAPI(palavraChave: string) {
    this.carregamento.concluido = false;
    this.http.get<CursoModel[]>(
      this.baseUrl+"assets/API/cursos/lista-todos-cursos.json",
      {}
    )
      .subscribe({
        next: cursosObtidos => {
          this.buscaCursos.splice(0);
          cursosObtidos.forEach(v => {
            //TODO: Ao implementar o Back-End oficial, verificar se essa decisão deverá ser removida deste código!
            if(v.nome.toLowerCase().includes(palavraChave.toLowerCase()))
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
