// Arquivo: src/app/app.server.module.ts

import { NgModule, StaticProvider } from "@angular/core";
import { ServerModule } from '@angular/platform-server';

import { AppModule } from './app.module';
import { AppComponent } from './app.component';
import { getBackendUrl, getBaseUrl } from "./miscelaneous";

@NgModule({
  imports: [
    AppModule,
    ServerModule,
  ],
  bootstrap: [AppComponent],
  providers: [
    { provide: 'BASE_URL', useFactory: getBaseUrl, deps:[] },
    { provide: 'BACKEND_URL', useFactory: getBackendUrl, deps:[] }
  ],
})
export class AppServerModule {}
