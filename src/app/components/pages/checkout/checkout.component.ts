// Arquivo: src/app/components/pages/checkout/checkout.component.ts
import { Component, OnInit, ViewChild } from "@angular/core";
import { DarkModeService } from "../../../services/dark-mode.service";
import { CarrinhoService } from "../../../services/carrinho.service";
import { LoginService } from "../../../services/login.service";
import { Address, UserDataModel } from "../../../Models/UserData.Model";
import { Estado, IbgeBase, IBGEInterno } from "../../../Models/Ibge.Model";
import { HttpClient } from "@angular/common/http";
import { BsLocaleService } from "ngx-bootstrap/datepicker";
import { getBaseUrl } from "../../../miscelaneous";

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss']
})
export class CheckoutComponent implements OnInit {
  checkout = new MeioDePagamentoCartao();

  constructor(
    public darkMode: DarkModeService,
    public carrinho: CarrinhoService,
    public login: LoginService,
    public localeService:BsLocaleService,
    public http: HttpClient
  ) { }

  ngOnInit() {
    this.inicializarEndereco();
    this.carregarEstados();
    this.localeService.use('pt-br');
    if(!(!!this.login.Usuario))
      this.login.getUsuarioLogado(usuario =>
        this.mudarTipoCliente(usuario.usuario.documento.tipo)
      );
  }

  realizarPagamento(event: any) {
    console.log(event);
    let evento = event instanceof SubmitEvent ? (<SubmitEvent>event) : undefined;
  }

  private inicializarEndereco() {
    if (!!this.login.Usuario) {
      for (let endereco of this.login.Usuario.enderecos) {
        let palavrasChaves = [
          'casa', 'residencial', 'cs', 'res', 'resid','house','home',
          'apartamento', 'apt', 'apê', 'ap', 'apart','apartment',
          'cobrança', 'cob', 'cobranca', 'cobr','billing',
        ];
        let filtroString: boolean[] = [];
        for (let palavraChave of palavrasChaves)
          filtroString.push(
            endereco.descricao.includes(palavraChave) ||
            endereco.finalidade.includes(palavraChave)
          );
        if (filtroString.some(filtro => filtro)) {
          this.endereco = endereco;
          break;
        }
      }
      return;
    }
    this.endereco = new Address();
  }

  endereco = new Address();
  dadosPessoa = new UserDataModel();
  meioPgto = new MeioDePagamento();
  hoje = new Date();

  private carregarEstados(){
    if(!this.darkMode.suporteDarkMode)
      return;
    this.http.get<IbgeBase[]>('https://servicodados.ibge.gov.br/api/v1/localidades/estados', {
      params:{ "view":"nivelado" }
    }).subscribe({
      next:value => {
        let _regiao:IBGEInterno[] = [
          new IBGEInterno("Norte",[]),
          new IBGEInterno("Nordeste",[]),
          new IBGEInterno("Sudeste",[]),
          new IBGEInterno("Sul",[]),
          new IBGEInterno("Centro-Oeste",[]),
        ];
        value.forEach(valApiIbge=>{
          _regiao.forEach((val,indiceRegiao)=>{
            let comparacao = val.nomeRegiao.localeCompare(valApiIbge["regiao-nome"],undefined,{sensitivity:'accent'});
            if(comparacao === 0){
              _regiao[indiceRegiao].estados.push(new Estado(valApiIbge["UF-sigla"],valApiIbge["UF-nome"]));
            }
          });
        });
        _regiao.forEach(valIbge=>{
          let regioesDoBrasil = document.createElement('optgroup');
          regioesDoBrasil.label = valIbge.nomeRegiao;
          valIbge.estados.forEach(valEstado=>{
            let opcao = document.createElement('option');
            opcao.value = valEstado.sigla;
            opcao.innerText = valEstado.nome;
            regioesDoBrasil.appendChild(opcao);
          });
          document.getElementById('estados')?.appendChild(regioesDoBrasil);
        });
      }
    });
  }

  meioPgtoInutil:any;
  cidades: string[] = [];
  meioPgtoChange(evento: any) {
    if(typeof(evento) === 'string'){
      this.meioPgto.reset();
      switch (evento.toLowerCase()) {
        case 'cc':
          this.meioPgto.cartaoDeCredito = true;
          break;
        case 'boleto':
          this.meioPgto.boletoBancario = true;
          break;
        case 'pix':
          this.meioPgto.PIX = true;
          break;
      }
    }
  }

  mudancaSelectEstados() {
    if(!this.darkMode.suporteDarkMode)
      return;
    const estado = this.endereco.estado;
    this.http.get<Array<{ "municipio-nome"?: string }>>(
      `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${estado}/municipios`,
      {
        params:{
          view:'nivelado'
        }
      }).subscribe({
      next: valApiIBGE=>{
        this.cidades.splice(0);
        valApiIBGE.forEach(val => this.cidades.push(val["municipio-nome"] ?? ""));
      },
      error: err=>console.log(err)
    });
  }
  phDoc = '';
  mudarTipoCliente(value: string) {
    switch (value){
      case 'pf': this.phDoc = 'Ex.: 123.456.789-00'; break;
      case 'pj': this.phDoc =  'Ex.: 12.345.678/0001-90'; break;
      default: this.phDoc = 'CPF ou CNPJ?'; break;
    }
  }

  codigoPixCopiaCola?:string;
  srcQrCodePIX?:string;
  async copiarPix() {
    if(!this.codigoPixCopiaCola)
      return;
    await navigator.clipboard.writeText(this.codigoPixCopiaCola);
    let msgAlerta = 'Código do "Pix Copia e cola" ';
    msgAlerta += 'foi copiado para a área de transferência!\n';
    msgAlerta += 'Acesse o aplicativo do seu banco, acesse a opção de ';
    msgAlerta += '"pagamentos com PIX" (ou algo similar) e utilize o "PIX ';
    msgAlerta += 'copia e cola", cole este código lá e faço pagamento ';
    msgAlerta += 'normalmente!\nDepois clique no botao abaixo, "Avançar".';
    alert(msgAlerta);
  }

  gerarPix() {
    this.codigoPixCopiaCola = "ab8cd1efg2hi9jk3lm0no4pq-rs5tu vw6x yz7";
    this.srcQrCodePIX = getBaseUrl() + "assets/qrcode-hipotetico.png";
  }
}

class MeioDePagamento{
  public cartaoDeCredito = false;
  public PIX = false;
  public boletoBancario = false;
  public reset(){
    this.boletoBancario = false;
    this.PIX = false;
    this.cartaoDeCredito = false;
  }
}

class MeioDePagamentoCartao{
  public cardHolder = "";
  public cardCVC = "";
  public cardExpiration:Date=new Date();
  public cardNumber = "";
  public zip = "";
  public state = "";
  public city = "";
  public email = "";
  public name = "";
  public address = "";
  public cardDocument = "";

  public limparTudo(){
    this.cardHolder = "";
    this.cardCVC = "";
    this.cardNumber = "";
    this.zip = "";
    this.state = "";
    this.city = "";
    this.email = "";
    this.name = "";
    this.address = "";
    for (let meioDePagamentoCartaoKey in MeioDePagamentoCartao) {
      if(typeof(meioDePagamentoCartaoKey) !== 'undefined'){
      }
    }
    }
}
