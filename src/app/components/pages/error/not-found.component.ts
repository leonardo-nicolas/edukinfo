// Arquivo: src/app/components/pages/error/not-found.component.ts
import { Component, Inject, OnInit } from '@angular/core';

@Component({
  selector: 'app-not-found',
  templateUrl: './not-found.component.html',
  styleUrls: ['./not-found.component.scss']
})
export class NotFoundComponent implements OnInit {
  constructor(
    @Inject('BASE_URL') public baseUrl:string
  ) {}
  fundoUrl!:string;
  ngOnInit() {
    this.fundoUrl = `${this.baseUrl}assets/images/404.svg`
  }

}
