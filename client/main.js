/**
 * Created by ouyangcharles on 2016/12/12.
 */

import {Meteor} from 'meteor/meteor';
import {Template} from 'meteor/templating';
import {$} from 'meteor/jquery';

import clientsCollection from  '../imports/common';
import './routes';

// Subscribe the list of already authorized clients
// to auto accept
Template.authorize.onCreated(function () {
  this.subscribe('oauthApps');
});

// Get the login token to pass to oauth
// This is the best way to identify the logged user
Template.authorize.helpers({
  getToken: function () {
    return localStorage.getItem('Meteor.loginToken');
  }
});

// Auto click the submit/accept button if user already
// accepted this client
Template.authorize.onRendered(function () {
  const data = this.data;
  this.autorun(function (c) {
    const user = Meteor.user();
    if (user && user.oauth && user.oauth.athorizedClients && user.oauth.athorizedClients.indexOf(data.client_id()) > -1) {
      c.stop();
      $('button').click();
    }
  });
});

const updateTemplate = (newTemplate) => {
  newTemplate.replaces('authorize');
};

const logoutAll = () => {
  Meteor.call('oauthyc.logoutAll');
};

export {
  clientsCollection,
  updateTemplate,
  logoutAll,
};