/**
 * Created by ouyangcharles on 2016/12/20.
 */

// originated from https://github.com/RocketChat/rocketchat-oauth2-server/blob/master/oauth.coffee

import oauthserver from  'oauth2-server';
import bodyParser from 'body-parser';
import express from 'express';
import winston from 'winston';

import {Meteor} from 'meteor/meteor';
import {Accounts} from 'meteor/accounts-base';

import {Model} from './model';

export function OAuth2Server(config) {
  this.app = express();
  this.config = config;
  this.app.use(bodyParser.urlencoded({
    extended: true
  }));
  this.app.use(bodyParser.json());
  this.routes = express();
  this.oauth = oauthserver({
    model: new Model(config != null ? config : {}),
    grants: ['authorization_code', 'refresh_token'],
    debug: config.debug,
  });
  this.publishAuthorizedClients();
  this.initRoutes();
  return this;
}

OAuth2Server.prototype.publishAuthorizedClients = function () {
  return Meteor.publish('authorizedOAuth', function () {
    if (this.userId == null) {
      return this.ready();
    }
    return Meteor.users.find({
      _id: this.userId
    }, {
      fields: {
        'oauth.authorizedClients': 1
      }
    });
  });
};

OAuth2Server.prototype.initRoutes = function () {
  let debugMiddleware, self, transformRequestsNotUsingFormUrlencodedType;
  self = this;
  debugMiddleware = function (req, res, next) {
    if (self.config.debug === true) {
      winston.log('[OAuth2Server]', req.method, req.url);
    }
    return next();
  };

  transformRequestsNotUsingFormUrlencodedType = function (req, res, next) {
    if (!req.is('application/x-www-form-urlencoded') && req.method === 'POST') {
      if (self.config.debug === true) {
        winston.log('[OAuth2Server] Transforming a request to form-urlencoded with the query going to the body.');
      }
      req.headers['content-type'] = 'application/x-www-form-urlencoded';
      req.body = Object.assign({}, req.body, req.query);
    }
    return next();
  };

  this.app.all('/oauth/token', debugMiddleware, transformRequestsNotUsingFormUrlencodedType, this.oauth.grant());

  this.app.get('/oauth/authorize', debugMiddleware, Meteor.bindEnvironment(function (req, res, next) {
    let client;
    client = self.oauth.model.Clients.findOne({
      active: true,
      clientId: req.query.client_id
    });
    if (client == null) {
      return res.redirect('/oauth/error/404');
    }
    if (client.redirectUri !== req.query.redirect_uri) {
      return res.redirect('/oauth/error/invalid_redirect_uri');
    }
    return next();
  }));

  this.app.post('/oauth/authorize', debugMiddleware, Meteor.bindEnvironment(function (req, res, next) {
    let user;
    if (req.body.token == null) {
      return res.sendStatus(401).send('No token');
    }
    user = Meteor.users.findOne({
      'services.resume.loginTokens.hashedToken': Accounts._hashLoginToken(req.body.token)
    });
    if (user == null) {
      return res.sendStatus(401).send('Invalid token');
    }
    req.user = {
      id: user._id
    };
    return next();
  }));

  this.app.post('/oauth/authorize', debugMiddleware, this.oauth.authCodeGrant(function (req, next) {
    if (req.body.allow === 'yes') {
      Meteor.users.update(req.user.id, {
        $addToSet: {
          'oauth.authorizedClients': this.clientId
        }
      });
    }
    return next(null, req.body.allow === 'yes', req.user);
  }));

  this.app.use(this.routes);

  return this.app.all('/oauth/*', this.oauth.errorHandler());
};
