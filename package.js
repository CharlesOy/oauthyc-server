Package.describe({
  name: 'charlesoy:oauthyc-server',
  version: '0.0.1',
  summary: 'A OAuth2 server implementation Meteor package which is very easy to use.',
  git: 'https://github.com/CharlesOy/oauthyc-server.git',
  documentation: 'README.md'
});

Npm.depends({
  'lodash': '4.17.2',
  'winston': '2.3.0',
  'react': '15.4.0',
  'react-dom': '15.4.0',
});

Package.onUse(function (api) {
  api.versionsFrom('1.4.2.3');
  api.use('ecmascript');
  api.use('webapp');

  api.use([
    'rocketchat:oauth2-server',
  ], [
    'server',
    'client',
  ]);

  api.use([
    'simple:json-routes',
  ], [
    'server',
  ]);

  api.use([
    'templating',
    'accounts-ui',
    'kadira:flow-router',
    'kadira:blaze-layout',
    'aldeed:template-extension@4.0.0',
  ], [
    'client'
  ]);

  api.mainModule('server/main.js', ['server']);
  api.mainModule('client/main.js', ['client']);
});

Package.onTest(function (api) {
  api.use('ecmascript');
  api.use('tinytest');
  api.use('charlesoy:oauthyc-server');
  api.mainModule('test/tests.js');
});