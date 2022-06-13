// Arquivo: src/app/components/pages/course/course.component.ts
import { Component, Inject, OnInit } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { DarkModeService } from "../../../services/dark-mode.service";
import { ActivatedRoute } from "@angular/router";
import { CursoModel } from 'src/app/Models/Curso.Model';
import { CarrinhoService } from "../../../services/carrinho.service";
import { LoginService } from "../../../services/login.service";

@Component({
  selector: 'app-course',
  templateUrl: './course.component.html',
  styleUrls: ['./course.component.scss']
})
export class CourseComponent implements OnInit {
  // TODO: definir a URL do Back-End.

  public baseUrl:string;
  public backendUrl:string;

  constructor(
    private http:HttpClient,
    public darkMode:DarkModeService,
    public carrinho: CarrinhoService,
    public login: LoginService,
    private activatedRoute: ActivatedRoute,
    @Inject('BASE_URL') baseUrl:string,
    @Inject('BACKEND_URL') backendUrl:string
  ) {
    this.baseUrl = baseUrl;
    this.backendUrl = backendUrl;
  }

  ngOnInit() {
    this.activatedRoute.paramMap.subscribe(params => {
      this.carregarDados(parseInt(params.get('id') ?? ""));
    });
  }
  carregamento = {
    concluido: false,
    comErro:false
  }
  dadosCurso:CursoModel = new class implements CursoModel {
    descontinuado = false;
    descricao = "";
    gradeMaterias = [];
    id = -1;
    imagensSlideCurso = [];
    nome="";
    preco=-1;
  };

  //TODO:Remover a API fake e colocar o Back-End correto para listar os cursos.
  carregarDados(idCurso:number){
    if(!this.darkMode.suporteDarkMode)
      return;
    this.carregamento.concluido = false;
    if(isNaN(idCurso)){
      this.carregamento.concluido=true;
      this.carregamento.comErro = true;
      console.log("A URL informada é inválida! Por favor, selecione um ID correto ou utilize a navegação do site!");
      return;
    }
    this.http.get<CursoModel>(this.backendUrl+`/site/cursos` ,{params:{id:idCurso}})
      .subscribe({
        next: cursosObtidos => {
          this.dadosCurso.id = cursosObtidos.id;
          this.dadosCurso.descricao = cursosObtidos.descricao;
          this.dadosCurso.nome = cursosObtidos.nome;
          this.dadosCurso.preco = cursosObtidos.preco;
          this.dadosCurso.descontinuado = cursosObtidos.descontinuado;
          cursosObtidos.imagensSlideCurso.forEach(slide=>this.dadosCurso.imagensSlideCurso.push(slide));
          cursosObtidos.gradeMaterias?.forEach(slide=>this.dadosCurso.gradeMaterias?.push(slide));
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
  readonly atribuirUrl = (url:string) => url.replace('@baseUrl%/',this.baseUrl);
}
