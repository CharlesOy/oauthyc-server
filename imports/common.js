/**
 * Created by ouyangcharles on 2016/12/15.
 */

import {Meteor} from 'meteor/meteor';

const clientsCollection = new Meteor.Collection('custom_oauth_clients');
export default clientsCollection;
