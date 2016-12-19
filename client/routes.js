/**
 * Created by ouyangcharles on 2016/12/15.
 */

import {FlowRouter} from 'meteor/kadira:flow-router';
import {BlazeLayout} from 'meteor/kadira:blaze-layout';

import './main.html';
import './style.css';

// Define the route to render the popup view
FlowRouter.route('/oauth/authorize', {
  action: function (params, queryParams) {
    BlazeLayout.render('authorize', queryParams);
  }
});