import {Component, Inject, OnInit} from '@angular/core';
import {environment} from "../../../../environments/environment";

@Component({
  selector: 'app-not-found',
  templateUrl: './not-found.component.html',
  styleUrls: ['./not-found.component.scss']
})
export class NotFoundComponent implements OnInit {
  public baseUrl:string

  constructor() {
    this.baseUrl = environment.baseUrl;
  }
  fundoUrl!:string;
  ngOnInit(): void {
    this.fundoUrl = `${this.baseUrl}assets/images/404.svg`
  }

}
