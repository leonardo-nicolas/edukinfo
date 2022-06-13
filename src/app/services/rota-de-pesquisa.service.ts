// Arquivo: src/app/services/rota-de-pesquisa.service.ts
import { Inject, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class RotaDePesquisaService {

  private baseUrl:string
  constructor(
    @Inject('BASE_URL') baseUrl:string
  ) {
    this.baseUrl = baseUrl;
  }
}
