import { Injectable } from '@angular/core';
import { UserDataModel} from '../Models/UserData.Model';
import { HttpClient } from '@angular/common/http';
import { environment } from "../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  private backendUrl: string;

  constructor(
    private http:HttpClient
  ) { this.backendUrl = environment.backendUrl; }
  private usuario?: UserDataModel;

  public get existeLogin():boolean { return localStorage.getItem('token') !== null || !!this.usuario; }

  public get Usuario(){ return this.usuario; }
  public set Usuario(value){
    if(typeof(value) === 'undefined' || value === null)
      throw Error("The value mustn't be undefined or null!");
    this.usuario = value;
  }

  fazerLogin(jwt: string, validade:Date, usuario?:UserDataModel) {
    localStorage.setItem('token',jwt);
    localStorage.setItem('vencimento', validade.toISOString());
    if (typeof (usuario) !== 'undefined') {
      this.usuario = usuario;
    }
  }


  getUsuarioLogado(){
    if(!this.existeLogin) return;
    this.http.post<UserDataModel>(this.backendUrl + '/usuarios/obter-usuario',undefined,{
      headers:{
        Authorization: 'Bearer ' + localStorage.getItem('token')
      }
    }).subscribe({
      next: result => {
        this.Usuario = result;
      },
      error: erro => console.log(erro)
    });
  }
}
