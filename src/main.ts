import { enableProdMode, StaticProvider } from "@angular/core";
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';
import { getBackendUrl, getBaseUrl } from "./app/miscelaneous";
import { defineLocale, ptBrLocale } from "ngx-bootstrap/chronos";

if (environment.production) {
  enableProdMode();
}
function bootstrap() {
  defineLocale('pt-br', ptBrLocale);
  const factory:StaticProvider[] = [
    { provide: 'BASE_URL', useFactory: getBaseUrl, deps:[] },
    { provide: 'BACKEND_URL', useFactory: getBackendUrl, deps:[] }
  ];
  platformBrowserDynamic(factory).bootstrapModule(AppModule)
  .catch(err => console.error(err));
};

if (typeof(document) !== 'undefined' && document.readyState === 'complete') {
  bootstrap();
} else {
  document?.addEventListener('DOMContentLoaded', bootstrap);
}

