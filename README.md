# OAuthyc Server

### Description

An OAuth2 Server implementation Meteor package with single-sign-on & single-sign-out.

**Single-sign-out** is supported if all your OAuth2 Client is using [charlesoy:oauthyc-client][1].

### Documentation

#### Installation

Install the package.

```bash
$ meteor add charlesoy:oauthyc-server
```

#### Configure OAuth2 Server

Configure on your oauth2 server, **note that redirectUrl path must be 'http<span></span>://.../_oauth/OAuthService'**.

```bash
import {configOAuth2} from 'meteor/charlesoy:oauthyc-server';

configOAuth2({
  service: 'OAuth2Service',
  clientId: 'EFyn3MxgPWJpzgrj4',
  clientSecret: 'D4_coHrw96QJjeMVqNRYA0BzmsOVCNLM6Vp4tdjkJOU',
  redirectUrl: 'http://localhost:3000/_oauth/OAuth2Service',

  // OPTIONAL
  singleSignOut: false, // false by default.
});
```

#### Configure OAuth2 Client

configure the details in some server file on your oauth2 client side(eg. accounts.js).

Here is an example.

```javascript
import {configOAuthyc} from 'meteor/charlesoy:oauthyc-client';

configOAuthyc({
  clientId: 'EFyn3MxgPWJpzgrj4',
  secret: 'D4_coHrw96QJjeMVqNRYA0BzmsOVCNLM6Vp4tdjkJOU',
  loginUrl: 'http://localhost:3100/oauth/authorize',
  tokenUrl: 'http://localhost:3100/oauth/token',
  infoUrl: 'http://localhost:3100/account',

  // OPTIONAL
  loginStyle: 'redirect', // can only be 'redirect' or 'popup', by default, it's 'redirect'.
  idProp: 'id', // by default, 'id' will be used.
});
```

#### Data Format

The format of user information returned to client is like below.

```javascript
{
  id: id,
  name: name,
  email: email,
}
```

This will be configurable in the coming version.

#### Logout

Call logoutAll() in client code (of OAuth2 Server Application) to sign out all applications registered on OAuth2 server.

```javascript
import {logoutAll} from 'meteor/charlesoy:oauthyc-client'; 

// ...

logoutAll();
```

#### Customize Your Own Template

The default UI is not very good looking (**just for now, and I'm still working on it**), but it's configurable by customizing your own UI template.

```bash
-oauth
 |-main.html
 |-main.js
 |-style.css
```

The ```main.html``` file should contain the fundemental fields.

```html
<template name="authenticate">
  {{#if currentUser}}
    <form method="post" action="" role="form" class="{{#unless Template.subscriptionsReady}}hidden{{/unless}}">
      <h2>Authenticate</h2>
      <input type="hidden" name="allow" value="yes">
      <input type="hidden" name="token" value="{{getToken}}">
      <input type="hidden" name="client_id" value="{{client_id}}">
      <input type="hidden" name="redirect_uri" value="{{redirect_uri}}">
      <input type="hidden" name="response_type" value="code">
      <button type="submit">Authorise</button>
    </form>
    {{#unless Template.subscriptionsReady}}
      loading...
    {{/unless}}
  {{else}}
    {{> loginButtons}}
  {{/if}}
</template>
```

Replace the default template in ```main.js```.

```javascript
import {Template} from 'meteor/templating';
import {updateTemplate} from 'meteor/charlesoy:oauthyc-server';

import './main.html';
import './style.css';

updateTemplate(Template.authenticate);
```

Finally, customize whatever style you like in ```style.css```.

#### Manage from Client

Also, the client collection is available from both client side and server side so that you can manage it yourself.

```javascript
import {clientsCollection} from 'meteor/charlesoy:oauthyc-server';

// do whatever you like with clientsCollection
```

### Licence

MIT

[1]: https://atmospherejs.com/charlesoy/oauthyc-client