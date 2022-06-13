// Arquivo: src/app/components/pages/shopping-cart/shopping-cart.component.scss
import { Component, OnInit } from '@angular/core';
import {DarkModeService} from "../../../services/dark-mode.service";
import {CarrinhoService} from "../../../services/carrinho.service";

@Component({
  selector: 'app-shopping-cart',
  templateUrl: './shopping-cart.component.html',
  styleUrls: ['./shopping-cart.component.scss']
})
export class ShoppingCartComponent implements OnInit {

  constructor(
    public darkMode: DarkModeService,
    public carrinho: CarrinhoService
  ) { }

  ngOnInit() {}

}
