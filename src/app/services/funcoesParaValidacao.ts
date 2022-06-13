// Arquivo: src/app/services/funcoesParaValidacao.ts
import { formatarDocumento } from './funcoesDiversas';

export function validarCpf(cpf:string|number):boolean{
  cpf = typeof(cpf) === 'string' ? cpf.replace(/[^0-9]+/g,'') : formatarDocumento(cpf,'pf');
  if(cpf === '')
    return false;
  let invalidos = [
    "00000000000",
    "11111111111",
    "22222222222",
    "33333333333",
    "44444444444",
    "55555555555",
    "66666666666",
    "77777777777",
    "88888888888",
    "99999999999"
  ];
  // Elimina CPFs inválidos conhecidos
  if (invalidos.some(val=>val===cpf))
    return false;
  let soma = 0, resto;
  for (let peso1=1; peso1<=9; peso1++)
    soma += parseInt(cpf.substring(peso1-1, peso1)) * (11 - peso1);
  resto = (soma * 10) % 11;
  if (resto >= 10)
    resto = 0;
  if (resto !== parseInt(cpf.substring(9, 10)))
    return false;
  soma = 0;
  for (let peso2 = 1; peso2 <= 10; peso2++)
    soma = soma + parseInt(cpf.substring(peso2-1, peso2)) * (12 - peso2);
  resto = (soma * 10) % 11;
  if (resto >= 10)
    resto = 0;
  return resto === parseInt(cpf.substring(10, 11));
}

export function validarCnpj(cnpj:string|number):boolean {
  cnpj = typeof(cnpj) === 'string' ? cnpj.replace(/[^0-9]+/g,'') : formatarDocumento(cnpj,'pj');

  if(cnpj === '') return false;

  if (cnpj.length != 14)
    return false;
  let invalidos = [
    "00000000000000",
    "11111111111111",
    "22222222222222",
    "33333333333333",
    "44444444444444",
    "55555555555555",
    "66666666666666",
    "77777777777777",
    "88888888888888",
    "99999999999999"
  ];
  // Elimina CNPJs invalidos conhecidos
  if (invalidos.some(val=>val===cnpj))
    return false;

  // Valida DVs
  let tamanho = cnpj.length - 2
  const numeros = cnpj.substring(0,tamanho);
  const digitos = cnpj.substring(tamanho);
  let soma = 0;
  let pos = tamanho - 7;
  for (let indice = tamanho; indice >= 1; indice--) {
    soma += parseInt(numeros.charAt(tamanho - indice)) * pos--;
    if (pos < 2)
      pos =  9;
  }
  let resultado = soma % 11 < 2 ? 0 : 11 - soma % 11;
  if (resultado !== parseInt(digitos.charAt(0)))
    return false;

  tamanho += 1;
  soma = 0;
  pos = tamanho - 7;
  for (let indice = tamanho; indice >= 1; indice--) {
    soma += parseInt(numeros.charAt(tamanho - indice)) * pos--;
    if (pos < 2)
      pos = 9;
  }
  resultado = soma % 11 < 2 ? 0 : 11 - soma % 11;
  return resultado === parseInt(digitos.charAt(1));
}

export function validarEmail(email:string) {
  if(typeof(window) === 'undefined') {
    return /^$/.test(email);
  }else {
    let campo = document.createElement("input");
    campo.type = "email";
    campo.value = email;
    return campo.validity.valid;
  }
}
