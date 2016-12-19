/**
 * Created by ouyangcharles on 2016/12/12.
 */

import winston from 'winston';

import {Meteor} from 'meteor/meteor';
import {WebApp} from 'meteor/webapp';
import {OAuth2Server} from 'meteor/rocketchat:oauth2-server';

import './publications/oauthApps';
import clientsCollection from '../imports/common';

winston.level = 'info';

const oauth2server = new OAuth2Server({
  accessTokensCollection: new Meteor.Collection('custom_oauth_access_tokens'),
  refreshTokensCollection: new Meteor.Collection('custom_oauth_refresh_tokens'),
  clientsCollection: clientsCollection,
  authCodesCollection: new Meteor.Collection('custom_oauth_auth_codes'),
  debug: true
});

// Add the express routes of OAuth before the Meteor routes
WebApp.rawConnectHandlers.use(oauth2server.app);

// Add a route to return account information
oauth2server.routes.get('/account', oauth2server.oauth.authorise(), function (req, res) {
  const user = Meteor.users.findOne(req.user.id);
  res.send({
    id: user._id,
    name: user.name,
    email: user.emails[0].address,
  });
});

const configClient = (client, upsert = true) => {
  const selector = {clientId: client.clientId};
  const count = clientsCollection.find(selector).count();
  if (count !== 0) {
    if (upsert) {
      clientsCollection.remove(selector);
      winston.info(`${count} oauth2 client(s) removed.`);
    } else {
      throw new Error(`There is already an client which clientId is ${client.clientId}`);
    }
  }
  client.createdAt = new Date();
  client.active = true;
  winston.info('Adding oauth2 client:');
  winston.info(client);
  client._id = clientsCollection.insert(client);
};

export {
  clientsCollection,
  configClient,
  oauth2server,
};