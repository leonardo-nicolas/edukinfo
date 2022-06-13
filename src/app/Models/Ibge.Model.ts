// Arquivo: src/app/Models/Ibge.Model.ts
export class IBGEInterno {
  constructor(
    public nomeRegiao:string,
    public estados:Estado[]
  ) { }

}
export class Estado{
  constructor(
    private _sigla:string,
    private _nome:string
  ){}
  public get nome():string { return this._nome; }
  public get sigla():string { return this._sigla; }
}
export type IbgeBase = {
  "UF-id": number,
  "UF-sigla": string,
  "UF-nome": string,
  "regiao-id": number,
  "regiao-sigla": string,
  "regiao-nome": string
};

export interface ViaCEP {
  cep?: string
  logradouro?: string
  complemento?: string
  bairro?: string
  localidade?: string
  uf?: string
  ibge?: string
  gia?: string
  ddd?: string
  siafi?: string
  erro?:boolean
}
