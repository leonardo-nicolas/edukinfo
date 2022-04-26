import {Component, Inject } from '@angular/core';
import { environment } from 'src/environments/environment';
import { DarkModeService } from './services/dark-mode.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'projeto-loja-virtual';
  private baseUrl:string
  constructor(
    public darkMode:DarkModeService
  ) { this.baseUrl = environment.baseUrl; }

}
