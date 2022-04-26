import {Component, Input, OnInit, ViewChildren} from '@angular/core';
import {DarkModeService} from "../../../services/dark-mode.service";

@Component({
  selector: 'btn-dark-mode',
  templateUrl: './btn-dark-mode.component.html',
  styleUrls: ['./btn-dark-mode.component.scss']
})
export class BtnDarkModeComponent implements OnInit {
  className:string="";

  @Input('cssClass')
  public set cssClass(value:string){
    this.className = value;
  }
  constructor(public darkMode:DarkModeService) { }

  @ViewChildren('BtnToDarkMode')
  private btnInHtml?:HTMLButtonElement;
  ngOnInit(): void {
  }
}
