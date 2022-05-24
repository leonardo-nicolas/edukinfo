import { Injectable } from '@angular/core';
import {User, UserDataModel} from '../Models/UserData.Model';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(
    private http:HttpClient
  ) { }
  private usuario?: UserDataModel;

  public get Usuario(){
    return this.usuario;
  }
  public set Usuario(usr){
    if(typeof(usr) === 'undefined' || usr === null)
      throw Error("'usr' mustn't be undefined or null!");
    this.usuario = usr;
  }
  fazerLogin(jwt: string, validade:Date, usuario?:UserDataModel) {
    localStorage.setItem('token',jwt);
    localStorage.setItem('vencimento', validade.toISOString());
    if (typeof (usuario) !== 'undefined') {
      this.usuario = usuario;
    }
  }
}
