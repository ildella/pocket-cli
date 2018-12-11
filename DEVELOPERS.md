# DEVELOPERS

## Prep the client

```bash
git clone git://github.com/ildella/pocket-cli.git
cd pocket-cli
npm install
```

## Prep the auth proxy

In order to communicate with the Pocket API, we always need to send both the consumer key, unique to the pocket-cli app, and the user token, which is obtained trough a oauth exchange. 

We need to run a proxy that securely stores the uniquer pocket-cli consumer key to access the Pocket API.

To try it in dev, create a fresh [API key from Pocket](https://getpocket.com/developer/apps/new)
Store it in a file called .env in the project root, like this

```bash
POCKET='<your api key here...>'
```

The proxy server can be started locally:

```bash
wt serve src/server/auth-proxy.js --port 4040
```

## Run it

```bash
npm start
[or]
./bin/pocket-cli
```

### Link

```bash
npm link
sudo ln -s $HOME/n/lib/node_modules/pocklet-cli/bin/pocket-cli.js /usr/local/bin/pocket-cli-dev
```

## Depencencies. 

I have a quite strict policy on dependencies.
I do not use any famous nodejs command line interpreter or framework like commander, or inquirer along with chalk for coloring. I also do not use lodash and many other commons nodejs libraries.

I depend on:

  * Luxon - a dependency free, immutable momentjs
  * Colorette - a dependency free ansii coloring
  * Axios - http client, which has 2 dependencies

For now I depend on express and all its dependencies for the authentication part. A refactoring is due as there's no point in using express to make one HTTP endpoint.

[npm audit badge](...)
