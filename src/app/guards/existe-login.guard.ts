import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ExisteLoginGuard implements CanActivate {
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this.existeLogin();
  }
  async existeLogin(){
    let existeLogin = false;

    // é importante retornar o contrário, para não interferir nas rotas.
    // A idéia é proteger as rotas '/login','/cadastro' e '/senha'!
    // Então, se o retorno for de fato 'true', haverá um impedimento de acesso nessas rotas.
    // Como queremos que IMPEÇA o acesso em caso de sucesso, é importante ser desse jeito,
    // para evitar maiores dores de cabeça!
    return !existeLogin;
  }
}
