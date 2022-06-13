// Arquivo: src/app/services/funcoesDiversas.ts
import { TypeOfPerson } from "../Models/UserData.Model";

export function embaralharMatriz<T>(array: T[]) {
  for (let posicao = array.length - 1; posicao >= 0; --posicao) {
    let aleatorio = Math.floor(Math.random() * (posicao + 1));
    [array[posicao], array[aleatorio]] = [array[aleatorio], array[posicao]];
  }
  return array;
}

export function pontuarDocumento(doc:number|string, tipo:TypeOfPerson):string {
  doc = typeof(doc) === 'string' ? doc.replace(/^[0-9]+$/g,'') : formatarDocumento(doc,tipo);
  let documentoComMascara="";
  let pf = ['pf','PF','pF','Pf'], pj = ['pj','PJ','Pj','pJ'];
  if(pf.some(val=>val===tipo)){
    for(let indice=1;indice<=9;++indice)
      documentoComMascara += doc.charAt(indice-1) + ((indice % 3) === 0 ? "." : '');
    documentoComMascara = documentoComMascara.substring(0,documentoComMascara.length-1);
  } else if(pj.some(val=>val===tipo)){
    for(let indice=0;indice<2;++indice)
      documentoComMascara += doc.charAt(indice);
    documentoComMascara += ".";
    for(let indice=3;indice<=8;++indice)
      documentoComMascara += doc.charAt(indice - 1) + (indice === 5 ? "." : '');
    documentoComMascara += "/";
    for(let indice=9;indice<=12;++indice)
      documentoComMascara += doc.charAt(indice - 1);
  }
  documentoComMascara += '-' + doc.substring(doc.length - 2);
  return documentoComMascara;
}

export function formatarDocumento(documento:number, tipo:TypeOfPerson) : string{
  let strCpf = documento.toString();
  let comprimentoDocumento;
  switch(tipo){
    case 'pf':
    case 'PF':
    case 'Pf':
    case 'pF':
      comprimentoDocumento = 11;
      break;
    case 'pj':
    case 'PJ':
    case 'Pj':
    case 'pJ':
      comprimentoDocumento = 14;
      break;
  }
  while(strCpf.length < comprimentoDocumento)
    strCpf = "0" + strCpf;
  return strCpf;
}
