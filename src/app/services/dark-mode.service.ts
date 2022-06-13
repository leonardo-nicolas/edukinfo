// Arquivo: src/app/services/dark-mode.service.ts
import { Inject, Injectable, PLATFORM_ID } from "@angular/core";
import { isPlatformBrowser } from "@angular/common";

@Injectable({
  providedIn: 'root'
})
export class DarkModeService {
  private _darkMode:boolean;
  private _saveToLS = false;
  private readonly _propNameLS = "darkMode";
  public get isDarkMode(): boolean { return this._darkMode; }
  constructor(
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this._darkMode = this.obterPreDefinicaoDarkMode();
    this.definirEstado();
  }

  /**
   * Utilizado apenas para identificar se este código está sendo executado em
   * navegador ou pelo servidor.
   *
   * @returns boolean - `true` se estiver sendo executado em navegador, `false` se estiver sendo executado pelo servidor NodeJS.
   */
  public get suporteDarkMode(): boolean {
    return isPlatformBrowser(this.platformId) && 'matchMedia' in window;
  }

  private obterPreDefinicaoDarkMode(){
    if(!this.suporteDarkMode)
      return false;

    let data = new Date();
    let horario = {
      hora: data.getHours(),
      minuto : data.getMinutes()
    };
    let informacaoAnterior = localStorage?.getItem(this._propNameLS);
    //Entre 18:30 da noite e 05:30 da manhã, ainda está escuro.
    let estaDeNoite = (horario.hora >= 18 && horario.minuto >= 30) && (horario.hora <= 23 && horario.minuto <= 59);
    estaDeNoite = estaDeNoite || ((horario.hora >= 0 && horario.minuto >=0) && (horario.hora <= 5 && horario.minuto <= 30));
    return (typeof (informacaoAnterior) !== 'undefined' &&
      (informacaoAnterior === null)) ? estaDeNoite : informacaoAnterior === 'true';
  }
  private definirEstado(){
    if(!this.suporteDarkMode)
      return;
    let root = document.documentElement.style;
    root.setProperty('--bs-body-bg',this._darkMode ? '#424242' : '#fff');
    root.setProperty('--bs-body-color',this._darkMode ? '#fff' : '#000');
    this.definirLinks();
  }
  private definirLinks(){
    if(!this.suporteDarkMode)
      return;
    document
      .querySelectorAll('.btn-link')
      .forEach(elemento=>{
        if(this._darkMode)
          elemento.setAttribute('style', 'color:yellow');
        else
          elemento?.removeAttribute('style');
      });
  }
  public mudarEstado(onChangeStateCallback?:()=>void){
    this._darkMode = !this._darkMode;
    this.definirEstado();
    if(typeof(onChangeStateCallback) !== 'undefined')
      onChangeStateCallback();
  }
  public salvarMudancasLocal(){
    if(!this.suporteDarkMode)
      return;
    localStorage.setItem(this._propNameLS,`${this._darkMode}`);
  }
}
