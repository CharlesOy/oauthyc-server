// Import Tinytest from the tinytest Meteor package.
import {Tinytest} from "meteor/tinytest";

// Import and rename a variable exported by oauthyc-server.js.
import {name as packageName} from "meteor/charlesoy:oauthyc-server";

// Write your tests here!
// Here is an example.
Tinytest.add('oauthyc-server - example', function (test) {
  test.equal(packageName, "oauthyc-server");
});
