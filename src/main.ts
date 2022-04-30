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

export const injecoesDeDependencias:StaticProvider[] = [
  {
    provide:'BASE_URL',
    useFactory: getBaseUrl,
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
