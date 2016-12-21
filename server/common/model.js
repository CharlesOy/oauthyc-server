/**
 * Created by ouyangcharles on 2016/12/20.
 */

// originated from https://github.com/RocketChat/rocketchat-oauth2-server/blob/master/model.coffee

import winston from 'winston';

import {Meteor} from 'meteor/meteor';

let AccessTokens = void 0;
let AuthCodes = void 0;
let Clients = void 0;
let RefreshTokens = void 0;
let debug = void 0;

export function Model(config) {
  if (config == null) {
    config = {};
  }
  if (config.accessTokensCollectionName == null) {
    config.accessTokensCollectionName = 'oauth_access_tokens';
  }
  if (config.refreshTokensCollectionName == null) {
    config.refreshTokensCollectionName = 'oauth_refresh_tokens';
  }
  if (config.clientsCollectionName == null) {
    config.clientsCollectionName = 'oauth_clients';
  }
  if (config.authCodesCollectionName == null) {
    config.authCodesCollectionName = 'oauth_auth_codes';
  }
  this.debug = debug = config.debug;
  this.AccessTokens = AccessTokens = config.accessTokensCollection || new Meteor.Collection(config.accessTokensCollectionName);
  this.RefreshTokens = RefreshTokens = config.refreshTokensCollection || new Meteor.Collection(config.refreshTokensCollectionName);
  this.Clients = Clients = config.clientsCollection || new Meteor.Collection(config.clientsCollectionName);
  this.AuthCodes = AuthCodes = config.authCodesCollection || new Meteor.Collection(config.authCodesCollectionName);
}

Model.prototype.getAccessToken = Meteor.bindEnvironment(function (bearerToken, callback) {
  let e, token;
  if (debug === true) {
    winston.log(`[OAuth2Server] in getAccessToken (bearerToken: ${bearerToken})`);
  }
  try {
    token = AccessTokens.findOne({
      accessToken: bearerToken
    });
    return callback(null, token);
  } catch (error) {
    e = error;
    return callback(e);
  }
});

Model.prototype.getClient = Meteor.bindEnvironment(function (clientId, clientSecret, callback) {
  let client, e;
  if (debug === true) {
    winston.log(`[OAuth2Server] in getClient (clientId: ${clientId}, clientSecret: ${clientSecret})`);
  }
  try {
    if (clientSecret == null) {
      client = Clients.findOne({
        active: true,
        clientId: clientId
      });
    } else {
      client = Clients.findOne({
        active: true,
        clientId: clientId,
        clientSecret: clientSecret
      });
    }
    return callback(null, client);
  } catch (error) {
    e = error;
    return callback(e);
  }
});

Model.prototype.grantTypeAllowed = function (clientId, grantType, callback) {
  if (debug === true) {
    winston.log(`[OAuth2Server] in grantTypeAllowed (clientId: ${clientId}, grantType: ${grantType})`);
  }
  return callback(false, grantType === 'authorization_code' || grantType === 'refresh_token');
};

Model.prototype.saveAccessToken = Meteor.bindEnvironment(function (token, clientId, expires, user, callback) {
  let e, tokenId;
  if (debug === true) {
    winston.log(`[OAuth2Server] in saveAccessToken (token: ${token}, clientId: ${clientId}, user: ${user}, expires: ${expires})`);
  }
  try {
    tokenId = AccessTokens.insert({
      accessToken: token,
      clientId: clientId,
      userId: user.id,
      expires: expires
    });
    return callback(null, tokenId);
  } catch (error) {
    e = error;
    return callback(e);
  }
});

Model.prototype.getAuthCode = Meteor.bindEnvironment(function (authCode, callback) {
  let code, e;
  if (debug === true) {
    winston.log(`[OAuth2Server] in getAuthCode (authCode: ${authCode})`);
  }
  try {
    code = AuthCodes.findOne({
      authCode: authCode
    });
    return callback(null, code);
  } catch (error) {
    e = error;
    return callback(e);
  }
});

Model.prototype.saveAuthCode = Meteor.bindEnvironment(function (code, clientId, expires, user, callback) {
  let codeId, e;
  if (debug === true) {
    winston.log(`[OAuth2Server] in saveAuthCode (code: ${code}, clientId: ${clientId}, expires: ${expires}, user: ${user})`);
  }
  try {
    codeId = AuthCodes.upsert({
      authCode: code
    }, {
      authCode: code,
      clientId: clientId,
      userId: user.id,
      expires: expires
    });
    return callback(null, codeId);
  } catch (error) {
    e = error;
    return callback(e);
  }
});

Model.prototype.saveRefreshToken = Meteor.bindEnvironment(function (token, clientId, expires, user, callback) {
  let e, tokenId;
  if (debug === true) {
    winston.log(`[OAuth2Server] in saveRefreshToken (token: ${token}, clientId: ${clientId}, user: ${user}, expires: ${expires})`);
  }
  try {
    tokenId = RefreshTokens.insert({
      refreshToken: token,
      clientId: clientId,
      userId: user.id,
      expires: expires
    });
    callback(null, tokenId);
    return tokenId;
  } catch (error) {
    e = error;
    return callback(e);
  }
});

Model.prototype.getRefreshToken = Meteor.bindEnvironment(function (refreshToken, callback) {
  let e, token;
  if (debug === true) {
    winston.log(`[OAuth2Server] in getRefreshToken (refreshToken: ${refreshToken})`);
  }
  try {
    token = RefreshTokens.findOne({
      refreshToken: refreshToken
    });
    return callback(null, token);
  } catch (error) {
    e = error;
    return callback(e);
  }
});
