// Arquivo: src/app/guards/nao-existe-login.guard.ts
import { Injectable } from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree} from '@angular/router';
import { Observable } from 'rxjs';
import {LoginService} from "../services/login.service";

@Injectable({
  providedIn: 'root'
})
export class NaoExisteLoginGuard implements CanActivate {
  constructor(
    private router: Router,
    private loginService: LoginService
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this.existeLogin();
  }
  async existeLogin(){
    let existeLogin = this.loginService.existeLogin;
    if(existeLogin){
      this.router.navigate(['/dashboard']);
    }
    // é importante retornar o contrário, para não interferir nas rotas.
    // A idéia é proteger as rotas '/login','/cadastro' e '/senha'!
    // Então, se o retorno for de fato 'true', haverá um impedimento de acesso nessas rotas.
    // Como queremos que IMPEÇA o acesso em caso de login feito, é importante ser desse jeito,
    // para evitar acessos indevidos nessas rotas!
    return !existeLogin;
  }
}
