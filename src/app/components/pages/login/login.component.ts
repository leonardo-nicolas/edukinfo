import { Component, OnInit } from '@angular/core';
import { DarkModeService } from 'src/app/services/dark-mode.service';
import {ActivatedRoute, Router} from "@angular/router";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  //TODO:Implementar chamada de API para Login e para Recuperar Senha, além de Reset de form...
  secRecuperarSenha:boolean = false;
  constructor(
    private activatedRoute:ActivatedRoute,
    private router:Router,
    public darkMode: DarkModeService
  ) { }
  ngOnInit(): void {
    this.checagemDeRotas()
  }
  checagemDeRotas(){
    const route = this.activatedRoute.snapshot.paramMap.get('secao');
    switch (route) {
      case 'recuperarSenha':
        this.secRecuperarSenha = true;
        break;
      case null:
      case undefined:
      case '':
        this.secRecuperarSenha = false;
        break;
      default:
        this.router.navigate(['/404']);
    }
  }
}
