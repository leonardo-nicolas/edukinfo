// Arquivo: src/app/app.component.ts
import { Component, Inject, OnInit } from '@angular/core';
import { DarkModeService } from './services/dark-mode.service';
import {LoginService} from "./services/login.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'projeto-loja-virtual';
  private baseUrl:string
  constructor(
    public darkMode:DarkModeService,
    private loginService:LoginService,
    @Inject('BASE_URL') baseUrl: string
  ) {
    this.baseUrl = baseUrl;
  }

  ngOnInit(): void {
    //this.loginService.existeLogin
  }

  compEnd($event: CompositionEvent) {

  }
}
