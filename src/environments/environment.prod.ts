function getBaseUrl() {
  return document
    .getElementsByTagName('base')[0]
    .href;
}
function getBackendUrl() {
  return "";
}

export const environment = {
  production: true,
  baseUrl:getBaseUrl(),
  backendUrl:getBackendUrl()
};
