/**
 * Created by ouyangcharles on 2016/12/12.
 */

import winston from 'winston';

import {Meteor} from 'meteor/meteor';
import {WebApp} from 'meteor/webapp';
import {Picker} from 'meteor/meteorhacks:picker';
import {HTTP} from 'meteor/http';

import {OAuth2Server} from './common/oauth';
import clientsCollection from '../imports/common';
import './publications/oauthApps';
import './publications/users';

winston.level = 'info';

const accessTokensCollection = new Meteor.Collection('custom_oauth_access_tokens');
const refreshTokensCollection = new Meteor.Collection('custom_oauth_refresh_tokens');
const authCodesCollection = new Meteor.Collection('custom_oauth_auth_codes');

const oauth2server = new OAuth2Server({
  accessTokensCollection,
  refreshTokensCollection,
  clientsCollection,
  authCodesCollection,
  debug: true
});

// Add the express routes of OAuth before the Meteor routes
WebApp.rawConnectHandlers.use(oauth2server.app);

// Add a route to return account information
oauth2server.routes.get('/account', oauth2server.oauth.authorise(), function (req, res) {
  const user = Meteor.users.findOne(req.user.id);
  res.send({
    id: user._id,
    name: user.username,
    email: user.username,
    // email: user.emails ? user.emails[0].address : '',
  });
});

function handleLogoutAllDetails(userId) {
  // logout OAuth2 Server
  Meteor.users.update({
    _id: userId,
  }, {
    $set: {
      'services.resume.loginTokens': [],
    },
  }, {
    multi: true,
  });

  // logout all OAuth Clients
  const pipeline = [{
    $match: {
      userId,
    }
  }, {
    $group: {
      _id: '$clientId',
      accessToken: {
        $last: '$accessToken',
      },
    }
  },];
  const accessTokens = accessTokensCollection.aggregate(pipeline);
  const results = accessTokens.map((accessToken) => {
    const client = clientsCollection.findOne({clientId: accessToken._id});
    accessToken.logoutUri = client === void 0 ?
      client :
      `${client.redirectUri.split('/').slice(0, 3).join('/')}/oauthyc/logout/${accessToken.accessToken}`;
    return accessToken;
  }).filter(({logoutUri}) => {
    return logoutUri !== void 0;
  }).map(({logoutUri}) => {
    HTTP.call('GET', logoutUri);
    return logoutUri;
  });

  return results;
}

Picker.route('/oauthyc/logout_all/:token', (params, req, res) => {
  const {userId} = accessTokensCollection.findOne({accessToken: params.token});
  res.end(JSON.stringify(handleLogoutAllDetails(userId)));
});

const configOAuth2 = (client, upsert = true) => {
  const selector = {clientId: client.clientId};
  const count = clientsCollection.find(selector).count();
  if (count !== 0) {
    if (upsert) {
      clientsCollection.remove(selector);
    } else {
      throw new Error(`There is already an client which clientId is ${client.clientId}`);
    }
  }
  client.redirectUri = client.redirectUrl;
  delete client.redirectUrl;
  client.createdAt = new Date();
  client.active = true;
  winston.info('OAuth2 Client information:');
  winston.info(client);
  client._id = clientsCollection.insert(client);
};

Meteor.methods({
  'oauthyc.logoutAll'(){
    if (!Meteor.user()) {
      return;
    }
    const {_id} = Meteor.user();
    return handleLogoutAllDetails(_id);
  }
});

export {
  clientsCollection,
  configOAuth2,
  oauth2server,
};