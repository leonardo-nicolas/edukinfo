// Arquivo: src/app/Models/Unidades.ts
import { Address } from "./UserData.Model";
import {PicCurso} from "./Curso.Model";

export class Unidades extends Address {
  public get fotos():Imagem[]{ return this.fotosInterior; }
  private fotosInterior:Imagem[] = []
}

export class Imagem implements PicCurso {
  /**
   * Texto alternativo a exibir na imagem, caso ela não seja carregada.
   */
  public altTxt = "";
  /**
   * Descrição da imagem (tooltip exibido quando passa o mouse por cima).
   */
  public descricao = "";
  /**
   * URL da imagem
   */
  public url = "";
}
