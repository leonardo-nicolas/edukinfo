import { Component, OnInit } from '@angular/core';
import { DarkModeService } from 'src/app/services/dark-mode.service';
import {ActivatedRoute, Router} from "@angular/router";
import {HttpClient} from "@angular/common/http";
import { environment } from '../../../../environments/environment';
import { User } from 'src/app/Models/UserData.Model';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  //TODO:Implementar chamada de API para Login e para Recuperar Senha, além de Reset de form...
  secRecuperarSenha = false;
  loginComErro = false;
  backendUrl: string;
  constructor(
    private activatedRoute:ActivatedRoute,
    private router:Router,
    private http:HttpClient,
    public darkMode: DarkModeService
  ) { this.backendUrl = environment.backendUrl; }
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

  enviarForm() {
    if (!this.secRecuperarSenha) {
      let dados = new FormData();
      this.http.post<{
        jwt: string | undefined,
        validade: Date | undefined,
        usuario: User | undefined
        codErro: number | undefined,
        mensagem: string | undefined
      }>(this.backendUrl + '', dados, {
        responseType:"json"
      }).subscribe({
        next: resposta => {

        },
        error:err=>console.log(err)
      });
    }
  }
}
