# OAuthyc Server (Alpha)

### Description

**This package is still ongoing, there may be some bugs**.

A OAuth2 server implementation Meteor package which only needs very few configuration.

This package is mainly based on [rocketchat:oauth2-server][1].

### Document

#### Installation

Install the package.

```bash
$ meteor add charlesoy:oauthyc-server
```

#### Configuration

##### Basic Configuration

Configure your oauth2 client in some server file (eg. oauth.js)

```javascript
import {configClient} from 'meteor/charlesoy:oauthyc-server';

configClient({
  service: 'OAuth2Service', // OAuth2 service name
  clientId: 'yourClientIdString', // OAuth2 client ID
  clientSecret: 'yourClientSecretString', // OAuth2 client secret
  redirectUri: 'http://your.client/_oauth/OAuth2Service', // redirect uri
});
```

That's all for the basic configuration on oauth2 server side, configuration on oauth2 client side shall be like below. 

```bash
...
  service: 'OAuth2Service',
  clientId: 'yourClientIdString',
  clientSecret: 'yourClientSecretString',
  scope: [],
  loginUrl: 'http://your.server/oauth/authorize',
  tokenUrl: 'http://your.server/oauth/token',
  infoUrl: 'http://your.server/account',
...
```

##### Customize OAuth Template

The format of user information returned to client is like below.

```javascript
{
  id: id,
  name: name,
  email: email,
}
```

The default UI is not very good looking (**just for now, and I'm still working on it**), but it's configurable by customizing oauth template.

```bash
...
-oauth
 |-main.html
 |-main.js
 |-style.css
...
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

Finally, customize the style in ```style.css```.

### Manage from Client

TBD

### Licence

MIT

[1]: https://atmospherejs.com/rocketchat/oauth2-server