/*
 * Copyright 2020 FUJITSU LIMITED
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except
 * in compliance with the License. You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under the License
 * is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express
 * or implied. See the License for the specific language governing permissions and limitations under
 * the License.
 */

module.exports = {
  requestPath: getRequestPath,
  isRouted: isRoutedRequest,
  keystoneUrl: keystoneUrl
};

function keystoneUrl(config) {
  const urlKey = 'monasca-kibana-plugin.url';
  const portKey = 'monasca-kibana-plugin.port';
  const authUriKey = 'monasca-kibana-plugin.auth_uri';

  let url;

  if (config.get(urlKey) && config.get(portKey)) {
    url = `${config.get(urlKey)}:${config.get(portKey)}`;
  } else if (config.get(authUriKey)) {
    url = `${config.get(authUriKey)}`;
  } else {
    throw new Error(`Unexpected error, neither [${urlKey}, ${portKey}] nor ${authUriKey} found in config`);
  }

  return url;
}

function getRequestPath(request) {
  server.log(['MKP','status', 'debug', 'server/util'], 'getRequestPath: request.url.path: ${request.url.path}');
  return request.url.path;
}

function isESRequest(request) {
  return getRequestPath(request).startsWith('/elasticsearch');
}

function isSavedObjectsRequest(request) {
  let url;
  url = getRequestPath(request);
  server.log(['MKP','status', 'debug', 'server/util'], 'isSavedObjectsRequest: url: ${url}');
  return /\/api.*\/saved_objects\/_/.test(getRequestPath(request));
}

function isRoutedRequest(request) {
  return isESRequest(request) || isSavedObjectsRequest(request);
}

