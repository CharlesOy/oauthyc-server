/**
 * Created by ouyangcharles on 2016/12/15.
 */

import {Meteor} from 'meteor/meteor';

import clientsCollection from '../../imports/common';

if (Meteor.isServer) {
  Meteor.publish('oauthApps', function () {
    if (this.userId !== null) {
      return this.ready();
    }
    return clientsCollection.find();
  });
}
