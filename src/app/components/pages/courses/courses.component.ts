// Arquivo: src/app/components/pages/courses/courses.component.ts
import { Component, Inject, OnInit } from '@angular/core';
import { DarkModeService } from 'src/app/services/dark-mode.service';
import { CursoModel } from "../../../Models/Curso.Model";
import { HttpClient } from "@angular/common/http";
import {LoginService} from "../../../services/login.service";
import {CarrinhoService} from "../../../services/carrinho.service";

@Component({
  selector: 'app-courses',
  templateUrl: './courses.component.html',
  styleUrls: ['./courses.component.scss']
})
export class CoursesComponent implements OnInit {
  //TODO: trocar a API fake pelo Back-End oficial, quando o mesmo estiver pronto!
  public baseUrl:string;
  private backendUrl: string;


  constructor(
    private http:HttpClient,
    public login:LoginService,
    public carrinho:CarrinhoService,
    public darkMode:DarkModeService,
    @Inject('BASE_URL') baseUrl:string,
    @Inject('BACKEND_URL') backendUrl:string
  ) {
    this.baseUrl = baseUrl;
    this.backendUrl = backendUrl;
  }

  listagemCursos: CursoModel[] = [];

  carregamento = {
    concluido: false,
    comErro:false
  }

  ngOnInit() {
    if(this.darkMode.suporteDarkMode)
      this.carregaTodosCursos();
  }

  private carregaTodosCursos() {
    this.carregamento.concluido = false;
    this.http
      .get<CursoModel[]>(
        this.backendUrl+"/site/cursos",
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

  adicionarAoCarrinho(id: number) {
    this.carrinho.addCurso(this.listagemCursos[id])
  }
}
