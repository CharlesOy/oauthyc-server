Package.describe({
  name: 'charlesoy:oauthyc-server',
  version: '0.0.1',
  summary: 'A OAuth2 server package',
  git: 'https://github.com/CharlesOy/oauthyc-server.git',
  documentation: 'README.md'
});

Package.onUse(function (api) {
  api.versionsFrom('1.4.2.3');
  api.use('ecmascript');
  api.mainModule('oauthyc-server.js');
});

Package.onTest(function (api) {
  api.use('ecmascript');
  api.use('tinytest');
  api.use('charlesoy:oauthyc-server');
  api.mainModule('oauthyc-server-tests.js');
});
