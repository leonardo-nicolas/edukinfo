import { Component, Inject, OnInit } from '@angular/core';
import { DarkModeService } from 'src/app/services/dark-mode.service';
import { CursoModel } from "../../../Models/Curso.Model";
import { HttpClient } from "@angular/common/http";
import {environment} from "../../../../environments/environment";

@Component({
  selector: 'app-courses',
  templateUrl: './courses.component.html',
  styleUrls: ['./courses.component.scss']
})
export class CoursesComponent implements OnInit {
  //TODO: trocar a API fake pelo Back-End oficial, quando o mesmo estiver pronto!
  public baseUrl:string;
  // public backendUrl:string,


  constructor(
    private http:HttpClient,
    public darkMode:DarkModeService
  ) { this.baseUrl = environment.baseUrl; }

  listagemCursos: CursoModel[] = [];

  carregamento = {
    concluido: false,
    comErro:false
  }

  ngOnInit(): void {
    this.carregaTodosCursos();
  }

  private carregaTodosCursos() {
    this.carregamento.concluido = false;
    this.http
      .get<CursoModel[]>(
        this.baseUrl+"assets/API/cursos/lista-todos-cursos.json",
        {}
      )
      .subscribe({
        next: cursosObtidos => {
          this.listagemCursos.splice(0);
          cursosObtidos.forEach(
            v => this.listagemCursos.push(v)
          );
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
