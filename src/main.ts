import { enableProdMode, StaticProvider } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { AppModule } from './app/app.module';
import { environment } from './environments/environment';
import { defineLocale, ptBrLocale } from "ngx-bootstrap/chronos";

export function getBaseUrl() {
  return document
    .getElementsByTagName('base')[0]
    .href;
}

let backendUrl: string | undefined | null;

export function getBackendUrl(){
  if(!environment.production) {
    if(typeof(backendUrl) === 'undefined' || backendUrl === null)
      backendUrl = window.prompt(
        "Esta caixa é hipotética, pois ainda estamos em ambiente de desenvolvimento."+
        "\nInforme o URL do Back-End desta aplicação!"+
        "\n\nAtenção: Coloque a '/' (barra) obrigatóriamente no final! "+
        "Senão as chamadasde API do Front-End retornarão com erro 404!",
        "http://localhost/"
      );
  }
  return backendUrl ?? "";
}

export const injecoesDeDependencias:StaticProvider[] = [
  {
    provide:'BASE_URL',
    useFactory: getBaseUrl,
    deps: new Array<any>()
  },
  {
    provide: 'BACKEND_URL',
    useFactory: getBackendUrl,
    deps: new Array<any>()
  }
];

if (environment.production) {
  enableProdMode();
}

defineLocale('pt-br', ptBrLocale);

platformBrowserDynamic(injecoesDeDependencias)
  .bootstrapModule(AppModule)
  .catch(err => console.error(err));
