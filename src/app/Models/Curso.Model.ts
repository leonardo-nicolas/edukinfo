// Arquivo: src/app/Models/Curso.Model.ts
export interface PicCurso {
  url: string;
  altTxt: string;
  descricao: string;
}

export interface CursoModel {
  id: number;
  nome: string;
  descricao: string;
  descontinuado: boolean;
  preco: number;
  gradeMaterias?: string[];
  imagensSlideCurso: PicCurso[];
}

