// Arquivo: src/app/services/carrinho.service.ts
import { Injectable } from '@angular/core';
import { CursoModel } from "../Models/Curso.Model";
import { HttpClient } from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class CarrinhoService {
  private _desconto = 0;
  private _cursos:CursoModel[] = [];
  private _cupom = "";
  constructor(
    private http: HttpClient
  ) { }

  /**
   * Obtém o desconto obtido com o cupom aplicado.
   */
  public get desconto(){
    return this._desconto;
  }
  public aplicarDesconto(cupom:string){
    this._cupom = cupom;
    switch (cupom){
      case 'ESTACIO10':
        this._desconto = 10;
        break;
      case 'ESTACIO20':
        this._desconto = 20;
        break;
      case 'ESTACIO30':
        this._desconto = 30;
        break;

      default:
        this._desconto = 0;
        break;
    }
  }

  public get codigoCupom() { return this._cupom; }

  public get cursos():CursoModel[]{
    return this._cursos;
  }
  public addCurso(curso:CursoModel){
    this.cursos.push(curso);
  }

  public removerCurso(curso:CursoModel) {
    for (let posicaoArrayCurso = 0; posicaoArrayCurso < this.cursos.length; posicaoArrayCurso++) {
      if (this.cursos[posicaoArrayCurso].id === curso.id) {
        this.cursos.splice(posicaoArrayCurso, 1);
      }
    }
  }
  public get subtotal(){
    return this.cursos.reduce((somadoAteAgora,cursoAtual) => somadoAteAgora + cursoAtual.preco, 0);
  }
  public get totalItens(){
    return this.cursos.length;
  }
  public removerCursoIndex(index:number){
    this.cursos.splice(index,1);
  }
  public existeCurso(curso:CursoModel){
    return this.cursos.some(c => c.id === curso.id);
  }
}
