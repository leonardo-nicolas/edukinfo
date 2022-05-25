function getBaseUrl() {
  return document
    .getElementsByTagName('base')[0]
    .href;
}
function getBackendUrl() {
  return document
    .getElementsByTagName('base')[0]
    .href;
}

export const environment = {
  production: true,
  baseUrl:getBaseUrl(),
  backendUrl:getBackendUrl()
};
