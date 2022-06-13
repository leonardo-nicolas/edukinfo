import { Component, HostListener, Inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router";
import { DarkModeService } from '../../services/dark-mode.service';
import {environment} from "../../../environments/environment";
import {LoginService} from "../../services/login.service";

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent implements OnInit {
  public isCollapsed = {
    menuMobile:true,
    menuProdutos:true,
    menuCursos:true
  }
  navbarFixaNoTopo(){
    return typeof(window) !== 'undefined' && window.innerWidth >= 1200;
  }
  public baseUrl:string
  constructor(
    private activatedRoute: ActivatedRoute,
    public darkMode: DarkModeService,
    public login: LoginService,
    public router: Router,
    @Inject('BASE_URL') baseUrl:string
  ) { this.baseUrl = baseUrl; }
  keywordSearch:string="";
  ngOnInit(): void {
    this.login.getUsuarioLogado();
    this.preencherModelSearch();
  }

  isSearching:boolean=false;

  private preencherModelSearch(){
    this.activatedRoute.queryParams.subscribe(params => {
      this.keywordSearch = params['q'] ?? this.keywordSearch;
    });
  }

  public changeMenu(menu:'mobile'|'produtos'|'cursos'):void {
    switch(menu) {
      case 'mobile':
        this.isCollapsed.menuCursos = true;
        this.isCollapsed.menuProdutos = true;
        this.isCollapsed.menuMobile = !this.isCollapsed.menuMobile;
        break;
      case 'produtos':
        this.isCollapsed.menuCursos = true;
        this.isCollapsed.menuProdutos = !this.isCollapsed.menuProdutos;
        break;
      case 'cursos':
        this.isCollapsed.menuProdutos = true;
        this.isCollapsed.menuCursos = !this.isCollapsed.menuCursos;
        break;
    }
  }

  async digitandoPesquisa(eventoTecla: KeyboardEvent) {
    if(typeof(HTMLInputElement) === "undefined")
      return;
    if (eventoTecla.key === 'Enter') {
      this.isSearching = true;
      this.keywordSearch = (<HTMLInputElement>eventoTecla.target).value;
      await this.router.navigate(['/search'], { queryParams: { q: this.keywordSearch } });
      this.isSearching = false;
    }
  }
}
