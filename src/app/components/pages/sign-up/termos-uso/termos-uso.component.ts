// Arquivo: src/app/components/pages/sign-up/termos-uso/termos-uso.component.ts
import { Component, OnInit } from '@angular/core';
import { DarkModeService } from "../../../../services/dark-mode.service";

@Component({
  selector: 'app-termos-uso',
  templateUrl: './termos-uso.component.html',
  styleUrls: ['./termos-uso.component.scss']
})
export class TermosUsoComponent implements OnInit {
  constructor(
    private darkMode: DarkModeService
  ) {}

  ngOnInit() {}

  imprimir() {
    if (!this.darkMode.suporteDarkMode)
      return;
    let conteudo = document.getElementById('termos-uso')?.innerHTML,
      telaImpressao = window.open('about:blank', 'popup', 'width=800,height=600');
    if (!(!!telaImpressao) || !(!!conteudo))
      return;
    telaImpressao?.document.write('<!doctype html>');
    telaImpressao?.document.write('<html lang="pt-br"><head><title>Imprimir Termos de Uso</title><meta charset="utf-8">');
    telaImpressao?.document.write('<meta name="viewport" content="width=device-width, initial-scale=1">');
    telaImpressao?.document.write(`<style>table { border-collapse:collapse; border-spacing:0; empty-cells:show }
    td, th { vertical-align:top; font-size:12pt;}
    h1, h2, h3, h4, h5, h6 { clear:both;}
    ol, ul { margin:0; padding:0;}
    li { list-style: none; margin:0; padding:0;}
    span.footnodeNumber { padding-right:1em; }
    span.annotation_style_by_filter { font-size:95%; font-family:Ubuntu, Arial, sans-serif; background-color:#fff000;  margin:0; border:0; padding:0;  }
    span.heading_numbering { margin-right: 0.8rem; }* { margin:0;}
    .P1 { font-size:12pt; font-family:Ubuntu, Arial, sans-serif; writing-mode:horizontal-tb; direction:ltr;}
    .Link { color:#4f81bd; }
    .T1 { font-weight:bold; }
    .T2 { font-weight:bold; }</style>`);
    telaImpressao?.document.write('</head>');
    telaImpressao?.document.write(`</head><body>${conteudo}</body></html>`);
    telaImpressao?.window.print();
    telaImpressao?.window.close();
  }
}

