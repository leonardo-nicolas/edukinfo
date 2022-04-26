import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DarkModeService {
  private _darkMode:boolean;
  private _saveToLS = false;
  private readonly _propNameLS = "darkMode";
  public get isDarkMode(): boolean { return this._darkMode; }
  constructor() {
    this._darkMode = this.obterPreDefinicaoDarkMode();
    this.definirEstado();
  }
  private obterPreDefinicaoDarkMode():boolean{
    let data = new Date();
    let horario = {
      hora: data.getHours(),
      minuto : data.getMinutes()
    };
    let informacaoAnterior = localStorage.getItem(this._propNameLS);
    //Entre 18:30 da noite e 05:30 da manhã, ainda está escuro.
    let estaDeNoite = (horario.hora >= 18 && horario.minuto >= 30) && (horario.hora <= 23 && horario.minuto <= 59);
    estaDeNoite = estaDeNoite || ((horario.hora >= 0 && horario.minuto >=0) && (horario.hora <= 5 && horario.minuto <= 30));
    return (informacaoAnterior === null) ? estaDeNoite : informacaoAnterior === 'true';
  }
  private definirEstado():void{
    let root = document.documentElement.style;
    root.setProperty('--bs-body-bg',this._darkMode ? '#424242' : '#fff');
    root.setProperty('--bs-body-color',this._darkMode ? '#fff' : '#000');
    this.definirLinks();
  }
  private definirLinks(){
    document
      .querySelectorAll('.btn-link')
      .forEach(elemento=>{
        if(this._darkMode)
          elemento.setAttribute('style', 'color:yellow');
        else
          elemento.removeAttribute('style');
      });
  }
  public mudarEstado(onChangeStateCallback?:()=>void): void{
    this._darkMode = !this._darkMode;
    this.definirEstado();
    if(typeof(onChangeStateCallback) !== 'undefined')
      onChangeStateCallback();
  }
  public salvarMudancasLocal():void{
    localStorage.setItem(this._propNameLS,`${this._darkMode}`);
  }
}
