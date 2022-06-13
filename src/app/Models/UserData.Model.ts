// Arquivo: src/app/Models/UserData.Model.ts
export class UserDataModel {
  get senha(): string { return this.password; }
  set senha(value: string ){ this.password = value; }

  get enderecos(): Address[] { return this.addresses; }

  get telefones(): Phone[] { return this.phones; }

  get usuario(): User { return this.user; }

  private user: User = new User();
  private phones: Phone[] = [];
  private addresses: Address[] = [];
  private password: string = "";
}

export class User {
  get id(): number|undefined { return this.identificador; }
  set id(value: number|undefined) { this.identificador = value; }

  get email(): string { return this.mail; }
  set email(value: string) { this.mail = value; }

  get aniversario(): Date { return this.birthday; }
  set aniversario(value: Date) { this.birthday = value; }

  get genero(): Genre { return this.genre; }
  set genero(value: Genre) { this.genre = value; }

  get documento(): Document { return this.document; }

  get sobrenome(): string { return this.surname; }
  set sobrenome(value: string) { this.surname = value; }

  get nome(): string { return this.name; }
  set nome(value: string) { this.name = value; }

  private identificador?: number;
  private name: string = "";
  private surname: string = "";
  private document: Document = new Document();
  private genre: Genre = "O";
  private birthday: Date = new Date();
  private mail: string = "";
}
export type GenreMale = "M" | "m";
export type GenreFemale = "F" | "f";
export type GenreOthers = "O" | "o";
export type Genre = GenreMale | GenreFemale | GenreOthers;

export class Document {
  get numero(): string { return this.number; }
  set numero(value: string) { this.number = value; }

  get tipo(): TypeOfPerson { return this.type; }
  set tipo(value: TypeOfPerson) { this.type = value; }

  private type: TypeOfPerson = "PF";
  private number: string = "";
}
export type TypeOfPerson = 'PF'|'PJ'|'pf'|'pj'|'Pf'|'Pj'|'pF'|'pJ';
export class Phone {
  get id(): number|undefined { return this.identificador; }
  set id(value: number|undefined) { this.identificador = value; }

  get descricao(): string { return this.description; }
  set descricao(value: string) { this.description = value; }

  get chamadas(): boolean { return this.canCall; }
  set chamadas(value: boolean) { this.canCall = value; }

  get appsMensageiros(): Messaging { return this.messaging; }

  get numero(): string { return this.number; }
  set numero(value: string) { this.number = value; }

  get codigoArea(): number { return this.ddd; }
  set codigoArea(value: number) { this.ddd = value; }

  private identificador?: number;
  private ddd: number = 0;
  private number: string = "";
  private messaging: Messaging = new Messaging();
  private canCall: boolean = false;
  private description: string = "";
}

export class Messaging {
  get id(): number|undefined { return this.identificador; }
  set id(value: number|undefined) { this.identificador = value; }

  get telegram(): boolean { return this.isTelegram; }
  set telegram(value: boolean) { this.isTelegram = value; }

  get whatsApp(): boolean { return this.isWhatsApp; }
  set whatsApp(value: boolean) { this.isWhatsApp = value; }

  get weChat(): boolean { return this.isWeChat; }
  set weChat(value: boolean) { this.isWeChat = value; }

  get mensagemTexto(): boolean { return this.isSMS; }
  set mensagemTexto(value: boolean) { this.isSMS = value; }

  private identificador?: number;
  private isWhatsApp: boolean = false;
  private isTelegram: boolean = false;
  private isWeChat: boolean = false;
  private isSMS: boolean = false;
}

export class Address {
  get id(): number|undefined { return this.identificador; }
  set id(value: number|undefined) { this.identificador = value; }

  get descricao(): string { return this.description; }
  set descricao(value: string) { this.description = value; }

  get finalidade(): string { return this.purpose; }
  set finalidade(value: string) { this.purpose = value; }

  get estado(): string { return this.state; }
  set estado(value: string) { this.state = value; }

  get municipio(): string { return this.city; }
  set municipio(value: string) { this.city = value; }

  get bairro(): string { return this.neighbor; }
  set bairro(value: string) { this.neighbor = value; }

  get complemento(): string|undefined { return this.complement; }
  set complemento(value: string|undefined) { this.complement = value; }

  get numero(): string | number | undefined{ return this.number; }
  set numero(value: string | number | undefined) { this.number = value; }

  get endereco(): string { return this.address; }
  set endereco(value: string) { this.address = value; }

  get cep(): string { return this.zipCode; }

  set cep(value: string) { this.zipCode = value; }

  private identificador?: number;
  private zipCode: string = "";
  private address: string = "";
  private number?: string|number;
  private complement?: string;
  private neighbor: string = "";
  private city: string = "";
  private state: string = "";
  private purpose: string = "";
  private description: string = "";
}
