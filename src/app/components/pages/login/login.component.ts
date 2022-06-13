// Arquivo: src/app/components/pages/login/login.component.ts

import { Component, Inject, OnInit } from "@angular/core";
import { DarkModeService } from 'src/app/services/dark-mode.service';
import { ActivatedRoute, Router } from "@angular/router";
import { HttpClient } from "@angular/common/http";
import { LoginService } from "../../../services/login.service";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: [ './login.component.scss' ]
})
export class LoginComponent implements OnInit {
  secRecuperarSenha = false;
  backendUrl: string;
  secNovaSenha = false;

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    public darkMode: DarkModeService,
    @Inject('BACKEND_URL') backendUrl: string
  ) { this.backendUrl = backendUrl; }
  ngOnInit() {
    if (!this.darkMode.suporteDarkMode)
      return;
    window.scrollTo(0, 0);
    this.checagemDeRotas();
  }

  checagemDeRotas() {
    const route = this.activatedRoute.snapshot.paramMap.get('secao');
    switch (route) {
      case 'recuperarSenha':
        this.secRecuperarSenha = true;
        this.secNovaSenha = !!this.getQueryStringToken();
        break;
      case null:
      case undefined:
      case '':
        this.secRecuperarSenha = false;
        this.secNovaSenha = false;
        break;
      default:
        this.router.navigate([ '/404' ]);
    }
  }

  readonly getQueryStringToken = () => this.activatedRoute.snapshot.queryParamMap.get('token') ?? '';


  clickRecuperaSenha() {
    this.secRecuperarSenha = !this.secRecuperarSenha;
    this.secNovaSenha = false;
  }
}
