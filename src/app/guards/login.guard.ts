// Arquivo: src/app/guards/login.guard.ts
import { Injectable } from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree} from '@angular/router';
import {Observable} from 'rxjs';
import {LoginService} from "../services/login.service";

@Injectable({
  providedIn: 'root'
})
export class LoginGuard implements CanActivate {
  constructor(
    private router: Router,
    private loginService: LoginService
  ) { }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this.getState();
  }
  private async getState(){
    let existeLogin = this.loginService.existeLogin;
    if(existeLogin) {
      if (!this.loginService.checkValidade()) {
        existeLogin = false;
        await this.router.navigate(['/login']);
      }
    } else {
      await this.router.navigate(['/login']);
    }
    return existeLogin;
  }

}
