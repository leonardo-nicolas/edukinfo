import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { DarkModeService } from "../../../services/dark-mode.service";
import { BsLocaleService } from "ngx-bootstrap/datepicker";
import { ModalDirective } from "ngx-bootstrap/modal";
import { Address, Phone, UserDataModel } from 'src/app/Models/UserData.Model';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Estado, IbgeBase, IBGEInterno, ViaCEP } from "../../../Models/Ibge.Model";
import { validarCnpj, validarCpf, validarEmail } from "../../../services/funcoesParaValidacao";
import { Router } from "@angular/router";
import { pontuarDocumento } from 'src/app/services/funcoesDiversas';
import { DetailsDDDModel, estados } from "../../../Models/DetailsDDD.Model";
import {environment} from "../../../../environments/environment";
import { StatusCodes } from 'src/app/Models/StatusCodes';
@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss']
})
export class SignUpComponent implements OnInit {

  modelData = new UserDataModel();

  accordions = {
    "apresentacao":0,
    "dadosAcesso":1,
    "dadosPessoais":2,
  }
  leituraConfirmada = false;
  existenciaDeInfoValida = {
    "email":false,
    "documento":false,
    "userExistente": false,
    "userExistenteDocumento": false,
    "dataNasc":false
  }
  validacaoSenha = {
    "num":false,
    "spec":false,
    "lwr":false,
    "uppr":false,
    "iguais":false,
    "entre7e15":false
  }
  regexTestSenha = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[\[\]\-\/\\$*=_{}'%`´^~:;.,?!¡¿<>ªº°®ŧ←↓→øþĸŋđðßæ«»©“”nµ─·|+&@#ƒ„…†‡ˆ‰Š‹ŒŽ•–—š›œžŸ¢£¤¥¦§¨¬¹²³€]).{7,15}/;
  private baseUrl;
  private backendUrl;

  constructor(
    public darkMode:DarkModeService,
    private route:Router,
    private localeService:BsLocaleService,
    private http:HttpClient
  ) {
    this.baseUrl = environment.baseUrl;
    this.backendUrl = environment.backendUrl;
  }
  /**
   * Indica o menu de assistente...
   * O valor 999 sigifica carregamento com AJAX....
   */
  currentAccordion = 0;
  ngOnInit() {
    this.resetForm();
    this.carregarTodosOsDDDs();
    this.carregarEstados();
    this.localeService.use('pt-br');
  }
  /**
   * clique no botão 'Limpar form'
   */
  resetForm(){
    this.modelData.usuario.nome = '';
    this.modelData.usuario.sobrenome = '';
    this.modelData.usuario.documento.tipo = 'PF';
    this.modelData.usuario.documento.numero = '';
    this.modelData.usuario.genero = 'O';
    this.modelData.usuario.aniversario = new Date();
    this.modelData.usuario.email = '';
    this.modelData.senha = '';
    this.confirmacaoSenha = '';
    this.existenciaDeInfoValida.userExistente = false;
    this.documentoModelado = "";
    this.leituraConfirmada = false;
    this.modelData.telefones.splice(0);
    this.modelData.enderecos.splice(0);
    this.validarCampos();
  }

  confirmacaoSenha="";

  validatePwd(){
    let rxPwdParts = {
      num: /(?=.*\d)/,
      specChr: /(?=.*[\[\]\-\/\\$*=_{}'%`´^~:;.,?!¡¿<>ªº°®ŧ←↓→øþĸŋđðßæ«»©“”nµ─·|+&@#ƒ„…†‡ˆ‰Š‹ŒŽ•–—š›œžŸ¢£¤¥¦§¨¬¹²³€])/,
      lwr:/(?=.*[a-z])/,
      uppr:/(?=.*[A-Z])/
    }
    let existeSenha = this.modelData.senha !== '';
    let senhaObtida = this.modelData.senha;
    this.validacaoSenha.num = existeSenha && rxPwdParts.num.test(senhaObtida);
    this.validacaoSenha.spec = existeSenha && rxPwdParts.specChr.test(senhaObtida);
    this.validacaoSenha.lwr = existeSenha && rxPwdParts.lwr.test(senhaObtida);
    this.validacaoSenha.uppr = existeSenha && rxPwdParts.uppr.test(senhaObtida);
    this.validacaoSenha.iguais = existeSenha && senhaObtida === this.confirmacaoSenha;
    this.validacaoSenha.entre7e15 = (senhaObtida.length >= 7 && senhaObtida.length <= 15);
    this.validarCampos()
  }

  readonly checkUserExists = () =>
    this.http.get<{userName:string,exists:boolean}>(this.backendUrl + "usuarios/checagem-usuario",{
      params: {
        "email": this.modelData.usuario.email
      }
    }).subscribe({
      next: resultado => {
        this.existenciaDeInfoValida.userExistente = resultado.exists;
        this.validarCampos();
      },
      error: e => console.log(e),
      complete: () => this.validarCampos()
    });
  readonly validarExistenciaDocumento = () =>
    this.http.get<{userName:string,exists:boolean}>(this.backendUrl + "usuarios/checagem-usuario",{
      params: {
        "documento": this.modelData.usuario.documento.tipo + this.modelData.usuario.documento.numero.replace(/\D/i, '')
      }
    }).subscribe({
      next: resultado => {
        this.existenciaDeInfoValida.userExistenteDocumento = resultado.exists;
        this.emailUsuarioAjaxDocumento = resultado.userName;
        this.validarCampos();
      },
      error: e => console.log(e),
      complete: () => this.validarCampos()
    });
  /**
   * Quando o usuário digita o CPF, é feita uma validação imediata,
   * se não existe algum usuário com o mesmo CPF cadastrado no banco de dados...
   */
  emailUsuarioAjaxDocumento = "";
  /**
   * Enquanto os dados estiverem INVÁLIDOS, o botão de cadastro de usuários fica desativado.
   */
  botaoCadastroDesativado = true;
  validarCampos(){
    this.modelarDocumento();
    let isPF = (['pf','PF','pF','Pf']).some(val=>val===this.modelData.usuario.documento.tipo);
    this.existenciaDeInfoValida.documento = isPF ?
      validarCpf(this.modelData.usuario.documento.numero) :
      validarCnpj(this.modelData.usuario.documento.numero);
    this.existenciaDeInfoValida.email = validarEmail(this.modelData.usuario.email);
    let testesDeValidos = [
      this.existenciaDeInfoValida.email,
      !this.existenciaDeInfoValida.userExistente,
      this.regexTestSenha.test(this.modelData.senha),
      this.modelData.senha !== '' && this.modelData.senha === this.confirmacaoSenha,
      this.existenciaDeInfoValida.documento,
      this.modelData.usuario.nome !== '',
      isPF ? this.modelData.usuario.sobrenome !== '' : true,
      this.modelData.telefones.length > 0,
      this.modelData.enderecos.length > 0,
      !this.existenciaDeInfoValida.userExistenteDocumento,
      this.leituraConfirmada
    ];
    this.botaoCadastroDesativado = testesDeValidos.some(val=>!val);
  }

  documentoModelado ="";

  private modelarDocumento() {
    if(this.modelData.usuario.documento.numero === '') {
      this.documentoModelado = "";
      return;
    }
    switch(this.modelData.usuario.documento.tipo){
      case 'PF':
      case 'Pf':
      case 'pF':
        this.existenciaDeInfoValida.documento = validarCpf(this.modelData.usuario.documento.numero);
        break;
      case 'PJ':
      case 'Pj':
      case 'pJ':
        this.existenciaDeInfoValida.documento = validarCnpj(this.modelData.usuario.documento.numero);
        break;
    }
    this.documentoModelado = pontuarDocumento(this.modelData.usuario.documento.numero,this.modelData.usuario.documento.tipo);
  }
  contadorRegressivoPosCadastro = 7;

  /**
   * Apenas para exibição do modal, após a requisição Ajax...
   */
  @ViewChild('modalDeAlerta', { static: false })
  modalDeAlerta?: ModalDirective;

  detalhesErros: { erro: number | null, mensagem: string | null } = { erro: 0, mensagem: '' };

  enviarDados(){
    let json = JSON.stringify(this.modelData);
    let headerToPost = new HttpHeaders();
    headerToPost.set('content-type','application/json;charset=utf-8');
    ++this.currentAccordion;
    this.http.post<{
      jwt: string | null | undefined,
      validade: Date | null | undefined,
      erro: number | string | null | undefined,
      mensagen: string | null | undefined
    }>(this.backendUrl + "usuario/cadastrar", json,
      {headers:headerToPost}
    ).subscribe({
      next: retorno => {
        this.currentAccordion = 999; //Mostra a "bolinha" de "carregando"...
        if (!!retorno.erro) {
          this.detalhesErros.erro = parseInt(retorno.erro?.toString() ?? "0");
          this.modalDeAlerta?.show();
          return;
        }
        this.currentAccordion = 5; //Dá as boas vindas, mostrando um contador para redirecionamento.
        localStorage.setItem('token',retorno.jwt ?? '');
        localStorage.setItem('vencimento',retorno.validade?.toISOString() ?? (new Date()).toISOString());
        do {
          setTimeout(()=>{
            --this.contadorRegressivoPosCadastro;
          },1000);
        } while (this.contadorRegressivoPosCadastro > 0);
        this.route.navigate(['/dashboard']);
      },
      error: err => console.log(err)
    })
  }

  //#region "Caixa Modal"

  operation:'C'|'U' = 'C';
  indexDataToEdit: number = -1;
  isButtonDisabledModal:boolean = false;

  readonly fecharModal = (currentModal: ModalDirective) => currentModal.hide();

  readonly abrirCaixaModal = (modal: ModalDirective, operation:'C'|'U', dataType:'phone'|'address', index:number = -1) => {
    this.operation = operation;
    if(operation === 'C')
      this.isButtonDisabledModal = true;
    else if(operation === 'U' && dataType === 'phone') {
      this.isButtonDisabledModal = false;
      this.carregarDadosParaAtualizarTelefone(index);
    } else if(operation === 'U' && dataType === 'address') {
      this.isButtonDisabledModal = false;
      this.carregarDadosParaAtualizarEndereco(index);
    }
    this.indexDataToEdit = index;
    modal.show();
  }

  obterErroEmString() {
    let msg = StatusCodes[(this.detalhesErros.erro ?? 0)];
    return msg;
  }

  //#region "Métodos das janelas de modal

  cancelarOperacao(modal: ModalDirective, operation: 'phone'|'address') {
    this.limparDados(operation);
    this.fecharModal(modal);
  }
  aoAlterarDadosDoModal(data:'phone'|'address'):void{
    switch(data){
      case 'phone':
        this.aoAlterarDadosDoTelefone();
        break;
      case 'address':
        this.aoAlterarDadosDoEndereco();
        break;
    }
  }
  fecharModalComOK(modal: ModalDirective, data: 'phone'|'address') {
    if(this.operation === 'C' && data === 'phone')
      this.adicionarTelefone();
    else if (this.operation === 'U' && data === 'phone')
      this.atualizarTelefone();
    else if(this.operation === 'C' && data === 'address')
      this.adicionarEndereco();
    else if (this.operation === 'U' && data === 'address')
      this.atualizarEndereco();

    this.limparDados(data);
    this.fecharModal(modal);
  }
  removerDados(posicaoElemento: number, data:'phone'|'address') {
    switch(data){
      case 'phone':
        this.removerTelefone(posicaoElemento);
        break;
      case'address':
        this.removerEndereco(posicaoElemento);
        break;
    }
  }
  private limparDados(operation:'phone'|'address'){
    switch(operation){
      case 'phone':
        this.limparDadosParaAtualizarTelefone();
        break;
      case 'address':
        this.limparDadosParaAtualizarEndereco();
        break;
    }
  }
  //#endregion "Métodos das janelas de modal

  //#region "Telefone"

  readonly dadosModalTelefone:Phone = new Phone();
  private listOfDDD?:DetailsDDDModel[];
  regexValidaNumTel = /^(([2-4]\d{3})|((9[6-9])\d{3}))-?\d{4}$/;
  private carregarTodosOsDDDs(){
    this.http.get<DetailsDDDModel[]>(this.baseUrl + 'assets/API/listaDeDDDs.json').subscribe({
      next:value => {
        this.listOfDDD = value;
        this.listOfDDD.forEach(val=>{
          let optEl = document.createElement('option');
          optEl.value = `${val.prefixo}`;
          optEl.innerHTML = `${val.prefixo} - ${val.estado}`;
          document.getElementById('field-ddd')?.appendChild(optEl);
        })
      }
    });
  }
  formatarTelefone(posicao: number) : string {
    let numero = this.modelData.telefones[posicao].numero;
    numero = numero.replace(/\D/g,'');
    console.log(numero);
    let parte1="", parte2="";
    switch(numero.length){
      case 8:
        for(let i = 0; i < 4; i++)
          parte1 += numero.charAt(i);
        for(let i = 4; i < 8; i++)
          parte2 += numero.charAt(i);
        break;
      case 9:
        for(let i = 0; i < 5; i++)
          parte1 += numero.charAt(i);
        for(let i = 5; i < 9; i++)
          parte2 += numero.charAt(i);
        break;
      default: return numero;
    }
    return `${parte1}-${parte2}`;
  }
  changeDDD(value:string){
    let div = document.getElementById("detailsOfDDDs");
    let detDDD = this.listOfDDD?.filter(val => val.prefixo === parseInt(value))[0];
    let nomeEstado = estados.filter(val => val.sigla === detDDD?.estado ?? "")[0];
    let elementos = "";
    if(!!detDDD || !!nomeEstado) {
      elementos += `<p> Estado: ${detDDD?.estado} - ${nomeEstado?.nome}<br>
        Áreas atendidas:<ul>`;
      for (let item of detDDD?.regiao ?? [])
        elementos += "<li>" + item + "</li>";
      elementos += `</ul></p>`;
    }
    // @ts-ignore
    div?.innerHTML = elementos;
  }
  onChangeSelectDDD(){
    let value = document.getElementById('field-ddd') as HTMLSelectElement;
    this.changeDDD(value?.value ?? "");
    this.aoAlterarDadosDoModal('phone');
  }
  private aoAlterarDadosDoTelefone(){
    let {ddd,num} = {
      num:this.dadosModalTelefone.numero,
      ddd:`${this.dadosModalTelefone.codigoArea}`
    };
    let regexTodosDDDs = "(";
    this.listOfDDD?.forEach((val,posicao)=>{
      regexTodosDDDs += `${val?.prefixo ?? ''}`;
      regexTodosDDDs += posicao < (this.listOfDDD?.length ?? 0) - 1 ? '|' : ')';
    });
    this.isButtonDisabledModal =
      this.dadosModalTelefone.descricao === '' ||
      !(new RegExp(regexTodosDDDs)).test(ddd) ||
      !this.regexValidaNumTel.test(num);
  }
  private limparDadosParaAtualizarTelefone(){
    this.dadosModalTelefone.codigoArea = 0;
    this.dadosModalTelefone.chamadas = false;
    this.dadosModalTelefone.numero = this.dadosModalTelefone.descricao = "";
    this.dadosModalTelefone.appsMensageiros.whatsApp = false;
    this.dadosModalTelefone.appsMensageiros.telegram = false;
    this.dadosModalTelefone.appsMensageiros.weChat = false;
    this.dadosModalTelefone.appsMensageiros.mensagemTexto = false;
  }
  private carregarDadosParaAtualizarTelefone(posicao:number):void{
    this.dadosModalTelefone.codigoArea = this.modelData.telefones[posicao].codigoArea;
    this.dadosModalTelefone.chamadas = this.modelData.telefones[posicao].chamadas;
    this.dadosModalTelefone.numero = this.modelData.telefones[posicao].numero;
    this.dadosModalTelefone.descricao = this.modelData.telefones[posicao].descricao;
    this.dadosModalTelefone.appsMensageiros.telegram = this.modelData.telefones[posicao].appsMensageiros.telegram;
    this.dadosModalTelefone.appsMensageiros.mensagemTexto = this.modelData.telefones[posicao].appsMensageiros.mensagemTexto;
    this.dadosModalTelefone.appsMensageiros.weChat = this.modelData.telefones[posicao].appsMensageiros.weChat;
    this.dadosModalTelefone.appsMensageiros.whatsApp = this.modelData.telefones[posicao].appsMensageiros.whatsApp;
  }
  private atualizarTelefone():void{
    this.modelData.telefones[this.indexDataToEdit].codigoArea = this.dadosModalTelefone.codigoArea;
    this.modelData.telefones[this.indexDataToEdit].chamadas = this.dadosModalTelefone.chamadas;
    this.modelData.telefones[this.indexDataToEdit].numero = this.dadosModalTelefone.numero;
    this.modelData.telefones[this.indexDataToEdit].descricao = this.dadosModalTelefone.descricao;
    this.modelData.telefones[this.indexDataToEdit].appsMensageiros.telegram = this.dadosModalTelefone.appsMensageiros.telegram;
    this.modelData.telefones[this.indexDataToEdit].appsMensageiros.mensagemTexto = this.dadosModalTelefone.appsMensageiros.mensagemTexto;
    this.modelData.telefones[this.indexDataToEdit].appsMensageiros.weChat = this.dadosModalTelefone.appsMensageiros.weChat;
    this.modelData.telefones[this.indexDataToEdit].appsMensageiros.whatsApp = this.dadosModalTelefone.appsMensageiros.whatsApp;
    this.indexDataToEdit = -1;
  }
  private adicionarTelefone():void{
    let dataPhone = new Phone();
    dataPhone.codigoArea = this.dadosModalTelefone.codigoArea;
    dataPhone.chamadas = this.dadosModalTelefone.chamadas;
    dataPhone.numero = this.dadosModalTelefone.numero;
    dataPhone.descricao = this.dadosModalTelefone.descricao;
    dataPhone.appsMensageiros.telegram = this.dadosModalTelefone.appsMensageiros.telegram;
    dataPhone.appsMensageiros.mensagemTexto = this.dadosModalTelefone.appsMensageiros.mensagemTexto;
    dataPhone.appsMensageiros.weChat = this.dadosModalTelefone.appsMensageiros.weChat;
    dataPhone.appsMensageiros.whatsApp = this.dadosModalTelefone.appsMensageiros.whatsApp;
    this.modelData.telefones.push(dataPhone);
  }
  private removerTelefone(index:number):void{
    let msgConfirm = 'Tem certeza que deseja remover o ';
    msgConfirm += `"${this.modelData.telefones[index].descricao}", cujo o número é `;
    msgConfirm += `(${this.modelData.telefones[index].codigoArea}) ${this.modelData.telefones[index].numero}`;
    msgConfirm += "?";
    if(confirm(msgConfirm))
      this.modelData.telefones.splice(index,1);
  }
  //#endregion "Telefone"

  //#region "Endereço"

  municipios:string[]=[];
  cepInvalido=false;

  regexTestaCep = /^\d{5}-?\d{3}$/;
  private todosEstados:string[] = [];

  private carregarEstados(){
    this.http.get<IbgeBase[]>('https://servicodados.ibge.gov.br/api/v1/localidades/estados', {
      params:{
        "view":"nivelado"
      }
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
            this.todosEstados.push(valApiIbge["UF-sigla"]);
          });
        });
        let campoEstados = document.getElementById('field-estados');
        _regiao.forEach(valIbge=>{
          let grupo = document.createElement('optgroup');
          grupo.label = valIbge.nomeRegiao;
          valIbge.estados.forEach(valEstado=>{
            let opcao = document.createElement('option');
            opcao.value = valEstado.sigla;
            opcao.innerHTML = valEstado.nome;
            grupo.appendChild(opcao);
          });
          campoEstados?.appendChild(grupo);
        });
      }
    });
  }
  readonly dadosModalEndereco:Address = new Address();
  buscarCep() {
    this.aoAlterarDadosDoModal('address');
    if(!this.regexTestaCep.test(this.dadosModalEndereco.cep)){
      this.cepInvalido = true;
      return;
    }
    console.log('Consultando CEP...');
    let cepSanitizado = this.dadosModalEndereco.cep.replace('-', '');

    this.http.get<ViaCEP>(`https://viacep.com.br/ws/${cepSanitizado}/json`).subscribe({
      next: val=> {
        if (typeof (val.erro) !== 'undefined' && val.erro) {
          this.cepInvalido = true;
          return;
        }
        this.dadosModalEndereco.endereco = val?.logradouro ?? "";
        this.dadosModalEndereco.complemento = val?.complemento ?? "";
        this.dadosModalEndereco.bairro = val?.bairro ?? "";
        this.dadosModalEndereco.estado = val?.uf ?? "";
        this.dadosModalEndereco.municipio = val?.localidade ?? "";
        this.dadosModalEndereco.cep = val?.cep ?? this.dadosModalEndereco.cep;
        this.cepInvalido = false;
      },
      error: err=>console.log(err)
    });
  }
  onChangeSelectProvince() {
    this.aoAlterarDadosDoModal('address');
    let estado = this.dadosModalEndereco.estado;
    this.http.get<Array<{ "municipio-nome"?: string }>>(
      `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${estado}/municipios`,
      {
      params:{
        view:'nivelado'
      }
    }).subscribe({
      next: valApiIBGE=>{
        this.municipios.splice(0);
        valApiIBGE.forEach(val => this.municipios.push(val["municipio-nome"] ??  ""));
        console.log(valApiIBGE);
      },
      error: err=>console.log(err)
    });
  }

  private aoAlterarDadosDoEndereco(){
    let dados = this.dadosModalEndereco;
    this.isButtonDisabledModal =
      dados.descricao === '' ||
      !this.regexTestaCep.test(dados.cep) ||
      !(() => {
        switch(typeof(dados.numero)) {
          case 'string':
              return dados.numero !== '' ? (/\d|\d(.|,)?\d/igsmu).test(dados.numero) : dados.complemento !== '';
          case 'number': return isNaN(dados.numero);
          case 'undefined': return dados.complemento !== '';
          default: return false;
        }
      })() ||
      dados.endereco === '' ||
      dados.bairro === '' ||
      dados.municipio === '' ||
      !this.todosEstados.some(uf=>uf.localeCompare(dados.estado,undefined,{
        sensitivity:'accent'
      }) === 0);
  }
  private limparDadosParaAtualizarEndereco(){
    this.dadosModalEndereco.estado = "";
    this.dadosModalEndereco.cep = "";
    this.dadosModalEndereco.bairro = "";
    this.dadosModalEndereco.municipio = "";
    this.dadosModalEndereco.complemento = "";
    this.dadosModalEndereco.endereco = "";
    this.dadosModalEndereco.finalidade = "";
    this.dadosModalEndereco.numero = "";
    this.dadosModalEndereco.descricao = "";
  }
  private carregarDadosParaAtualizarEndereco(posicao:number):void{
    this.dadosModalEndereco.estado = this.modelData.enderecos[posicao].estado;
    this.dadosModalEndereco.cep = this.modelData.enderecos[posicao].cep;
    this.dadosModalEndereco.bairro = this.modelData.enderecos[posicao].bairro;
    this.dadosModalEndereco.municipio = this.modelData.enderecos[posicao].municipio;
    this.dadosModalEndereco.complemento = this.modelData.enderecos[posicao].complemento;
    this.dadosModalEndereco.endereco = this.modelData.enderecos[posicao].endereco;
    this.dadosModalEndereco.finalidade = this.modelData.enderecos[posicao].finalidade;
    this.dadosModalEndereco.numero = this.modelData.enderecos[posicao].numero;
    this.dadosModalEndereco.descricao = this.modelData.enderecos[posicao].descricao;
  }
  private atualizarEndereco():void{
    this.modelData.enderecos[this.indexDataToEdit].estado = this.dadosModalEndereco.estado;
    this.modelData.enderecos[this.indexDataToEdit].cep = this.dadosModalEndereco.cep;
    this.modelData.enderecos[this.indexDataToEdit].bairro = this.dadosModalEndereco.bairro;
    this.modelData.enderecos[this.indexDataToEdit].municipio = this.dadosModalEndereco.municipio;
    this.modelData.enderecos[this.indexDataToEdit].complemento = this.dadosModalEndereco.complemento;
    this.modelData.enderecos[this.indexDataToEdit].endereco = this.dadosModalEndereco.endereco;
    this.modelData.enderecos[this.indexDataToEdit].finalidade = this.dadosModalEndereco.finalidade;
    this.modelData.enderecos[this.indexDataToEdit].numero = this.dadosModalEndereco.numero;
    this.modelData.enderecos[this.indexDataToEdit].descricao = this.dadosModalEndereco.descricao;
    this.indexDataToEdit = -1;
  }
  private adicionarEndereco():void{
    let dataAddress = new Address();
    dataAddress.estado = this.dadosModalEndereco.estado;
    dataAddress.cep = this.dadosModalEndereco.cep;
    dataAddress.bairro = this.dadosModalEndereco.bairro;
    dataAddress.municipio = this.dadosModalEndereco.municipio;
    dataAddress.complemento = this.dadosModalEndereco.complemento;
    dataAddress.endereco = this.dadosModalEndereco.endereco;
    dataAddress.finalidade = this.dadosModalEndereco.finalidade;
    dataAddress.numero = this.dadosModalEndereco.numero;
    dataAddress.descricao = this.dadosModalEndereco.descricao;
    this.modelData.enderecos.push(dataAddress);
  }
  private removerEndereco(index:number):void{
    let msgConfirm = 'Tem certeza que deseja remover este endereço?';
    if(confirm(msgConfirm))
      this.modelData.telefones.splice(index,1);
  }
  //#endregion "Endereço"

  //#endregion "Caixa Modal"

}
