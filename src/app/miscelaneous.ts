// Arquivo: src/app/miscelaneous.ts

export function getBaseUrl() {
  if(typeof(window) === 'undefined')
    return "http://localhost:4200/";
  return document.getElementsByTagName('base')[0].href;
}
export function getBackendUrl() {
  let url = "https://edukinfo.localhost/";
  url = url.substring(url.length - 1,1) === '/' ? url.substring(url.length - 1,1) : url;
  return url + '/api';
}
