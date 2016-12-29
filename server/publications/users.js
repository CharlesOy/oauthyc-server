/**
 * Created by ouyangcharles on 2016/12/29.
 */

import {Meteor} from 'meteor/meteor';

if (Meteor.isServer) {
  Meteor.publish('userData', function () {
    return Meteor.users.find({_id: this.userId});
  });
}
