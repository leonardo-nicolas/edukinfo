import { Component, HostListener, Inject, OnInit } from '@angular/core';
import { ActivatedRoute } from "@angular/router";
import { DarkModeService } from '../../services/dark-mode.service';
import {environment} from "../../../environments/environment";

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
  navbarFixaNoTopo(): boolean{
    return window.innerWidth >= 1200;
  }
  public baseUrl:string
  constructor(
    private activatedRoute: ActivatedRoute,
    public darkMode: DarkModeService
  ) { this.baseUrl = environment.baseUrl; }
  keywordSearch:string="";
  ngOnInit(): void {
    this.adicionarEventoSearchInput();
    this.preencherModelSearch();
  }

  isSearching:boolean=false;
  estaLogado():boolean {
    return false;
  }
  private adicionarEventoSearchInput(){
    document.getElementById('searchInput')?.addEventListener('keyup',e => {
      e.preventDefault();
      if ( e.key === 'Enter'){
        document
          .getElementById("frmPesquisa")
          ?.getElementsByTagName('button')[0]
          ?.click();
      }
    });
  }

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
}
