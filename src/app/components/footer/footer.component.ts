import { Component, Inject, OnInit } from '@angular/core';
import {DarkModeService} from "../../services/dark-mode.service";
import {environment} from "../../../environments/environment";

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {
  public baseUrl:string;
  constructor(
    public darkMode:DarkModeService,
    @Inject('BASE_URL') baseUrl: string
  ) {
    this.baseUrl = baseUrl;
    let data = new Date();
    this.anoCorrente = data.getFullYear();
  }
  public anoCorrente: number;
  ngOnInit(){}

  scrollParaTopo(){
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}
